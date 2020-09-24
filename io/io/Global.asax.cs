﻿using System;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Microsoft.ClearScript.V8;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace io
{
    public class oSite
    {
        public int id { set; get; }
        public string name { set; get; }
        public string[] domains { set; get; }
        public string[] pages { set; get; }
    }

    public class oPage
    {
        public int id { set; get; }
        public int site_id { set; get; }
        public string key { set; get; }
        public string path { set; get; }
        public string theme { set; get; }
        public bool login { set; get; }
    }

    public static class self
    {
        static string[] mPaths = new string[] { };
        static ConcurrentDictionary<string, string> mCaches = new ConcurrentDictionary<string, string>();
        static ConcurrentDictionary<int, oSite> mSites = new ConcurrentDictionary<int, oSite>();
        static ConcurrentDictionary<int, oPage> mPages = new ConcurrentDictionary<int, oPage>();
        static ConcurrentDictionary<string, int> mDomainSite = new ConcurrentDictionary<string, int>();
        static ConcurrentDictionary<int, int> mPathPage = new ConcurrentDictionary<int, int>();

        static ConcurrentDictionary<string, string> mTokens = new ConcurrentDictionary<string, string>();
        static ConcurrentDictionary<string, string> mUserInfo = new ConcurrentDictionary<string, string>();

        static string[] mPass = new string[] { };

        static ConcurrentDictionary<string, string> mSite_Html = new ConcurrentDictionary<string, string>();
        static ConcurrentDictionary<string, string> mSite_Modules = new ConcurrentDictionary<string, string>();

        public static string[] mKitGroups = new string[] { };
        public static string[] mKits = new string[] { };

        public static string[] mUIGroups = new string[] { };
        public static string[] mUIs = new string[] { };
        static ConcurrentDictionary<string, string> mUI_Html = new ConcurrentDictionary<string, string>();
        static ConcurrentDictionary<string, string> mUI_Js = new ConcurrentDictionary<string, string>();
        static ConcurrentDictionary<string, string> mUI_Css = new ConcurrentDictionary<string, string>();

        public static string ROOT_PATH = "";
        public static void Init(HttpApplication app)
        {
            ROOT_PATH = app.Server.MapPath("~/");
        }

        #region [ APP_INIT ]

        public static void app_loadConfig(HttpApplication app)
        {
            List<string> listPaths = new List<string>() { };
            string file = app.Server.MapPath("~/io/config.json");
            if (File.Exists(file))
            {
                string json = File.ReadAllText(file);
                oSite[] sites = new oSite[] { };
                try
                {
                    sites = JsonConvert.DeserializeObject<oSite[]>(json);
                    var ss = sites.GroupBy(x => x.id).Select(x => x.Last()).ToArray();
                    foreach (var site in ss)
                    {
                        mSites.TryAdd(site.id, site);

                        string[] domains = new string[] { };
                        if (site.domains != null && site.domains.Length > 0)
                            domains = site.domains.Distinct().ToArray();
                        foreach (string domain in domains) mDomainSite.TryAdd(domain, site.id);

                        var pages = new string[][] { };
                        if (site.pages != null && site.pages.Length > 0)
                            pages = site.pages.Distinct()
                                .Select(x => x.ToLower().Split('.'))
                                .Where(x => x.Length == 3)
                                .ToArray();

                        foreach (var ps in pages)
                        {
                            var p = new oPage()
                            {
                                id = mPages.Count + 1,
                                key = string.Join(".", ps),
                                login = ps[2] == "1",
                                site_id = site.id,
                                path = ps[0],
                                theme = ps[1]
                            };
                            mPages.TryAdd(p.id, p);

                            foreach (var domain in domains)
                            {
                                string fullPath = string.Format("{0}/{1}", domain, ps[0]);
                                mPathPage.TryAdd(listPaths.Count, p.id);
                                listPaths.Add(fullPath);
                            }
                        }
                    }
                }
                catch { }
            }

            mPaths = listPaths.ToArray();
        }

        public static void user_loadAll(HttpApplication app)
        {
            mPass = new string[] { };
            mUserInfo.Clear();

            string fLogin = app.Server.MapPath("~/data/login.txt");
            if (File.Exists(fLogin))
                mPass = File.ReadAllLines(fLogin).Where(x => x.Trim().Length > 0).ToArray();

            string dir = app.Server.MapPath("~/data/user");
            if (Directory.Exists(dir))
            {
                string[] files = Directory.GetFiles(dir, "*.json");
                for (int i = 0; i < files.Length; i++)
                {
                    string name = Path.GetFileName(files[i]),
                        json = File.ReadAllText(files[i]);
                    name = name.Substring(0, name.Length - 5).ToLower().Trim();
                    mUserInfo.TryAdd(name, json);
                }
            }
        }

        #endregion

        #region [ USER_TOKEN ]

        private static string user_createToken(string username)
        {
            var jsSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string token = jsSerializer.Serialize(new
            {
                key = Guid.NewGuid(),
                username = username,
                created = DateTime.Now.ToString("yyyyMMddHHmmssfff")
            });

            string toEncode = HttpUtility.UrlEncode(token);
            byte[] toEncodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(toEncode);
            string sBase64 = System.Convert.ToBase64String(toEncodeAsBytes);
            return sBase64;
        }

        #endregion

        #region [ RESPONSE ]

        private static void response_Write(object item, string contentType = "application/json")
        {
            if (item != null)
            {
                string json;
                if (item is string) json = item as string;
                else
                {
                    var jsSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    json = jsSerializer.Serialize(item);
                }

                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.ContentType = contentType;
                HttpContext.Current.Response.Write(json);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.Close();
            }
        }

        private static bool response_rewritePath(HttpApplication app, string pathFile, oPage page)
        {
            if (page == null) return false;

            string key = string.Format("{0}.{1}", page.path, page.theme),
                file = app.Server.MapPath(pathFile),
                html = string.Empty;

            bool ok = false;

            if (mCaches.ContainsKey(key))
            {
                mCaches.TryGetValue(key, out html);
                ok = true;
            }
            else if (File.Exists(file))
            {
                html = File.ReadAllText(file);
                html = render_pageHtml(html, page);
                mCaches.TryAdd(key, html);
                ok = true;
            }

            if (ok)
            {
                //string name = "io_page_" + page.path.ToLower(), value = page.theme;
                //HttpContext.Current.Response.Cookies.Set(new HttpCookie(name, value));

                //name = "io_site_" + page.path.ToLower();
                //value = page.site_id.ToString();
                //HttpContext.Current.Response.Cookies.Set(new HttpCookie(name, value));

                response_Write(html, "text/html");
            }

            return ok;
        }

        #endregion

        #region [ ROUTER_RENDER ]

        static V8ScriptEngine mJsEngine = null;
        static string mJsVueScript = string.Empty;

        public static bool request_Router(HttpApplication app)
        {
            Uri url = HttpContext.Current.Request.Url;
            try
            {
                oPage page = null;
                int index = -1, id = -1;
                string domain = url.Authority, newPath,
                    path = HttpUtility.UrlDecode(url.AbsolutePath.ToLower().Substring(1)),
                    key = string.Format("{0}/{1}", domain, path.Length == 0 ? "index" : path),
                    file = string.Empty,
                    pathFile = string.Empty,
                    method = HttpContext.Current.Request.HttpMethod;
                if (method == "GET")
                {
                    if (path.EndsWith(".js"))
                    {
                        if (path.StartsWith("ui/"))
                            newPath = "~/io/" + path.Replace('_', '/').Replace(".", "/method.");
                        else
                            newPath = "~/" + path;
                        HttpContext.Current.RewritePath(newPath);
                        return true;
                    }

                    for (int i = 0; i < mPaths.Length; i++)
                    {
                        if (mPaths[i] == key)
                        {
                            index = i;
                            break;
                        }
                    }
                    if (index != -1
                        && mPathPage.ContainsKey(index)
                        && mPathPage.TryGetValue(index, out id)
                        && mPages.ContainsKey(id)
                        && mPages.TryGetValue(id, out page))
                    {
                        pathFile = string.Format("~/io/site/{0}.{1}.htm", page.path, page.theme);
                        if (response_rewritePath(app, pathFile, page) == false)
                        {
                            pathFile = string.Format("~/io/site/404.{0}.htm", page.theme);
                            if (response_rewritePath(app, pathFile, page) == false)
                            {
                                pathFile = "~/io/site/404.htm";
                                if (response_rewritePath(app, pathFile, page)) return true;
                            }
                            else return true;
                        }
                        else return true;
                    }

                    response_Write(new { Ok = false, Message = "Cannot find page: " + path });
                }
                else if (method == "POST")
                {
                    bool ok = false;
                    string text, json,
                        username = string.Empty,
                        result = string.Empty, token = string.Empty;
                    switch (path)
                    {
                        case "login":
                            try
                            {
                                var stream = new System.IO.StreamReader(app.Request.InputStream);
                                text = stream.ReadToEnd();
                                json = HttpUtility.UrlDecode(text);

                                var jsSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                                var dict = (Dictionary<string, object>)jsSerializer.DeserializeObject(json);

                                if (dict.ContainsKey("username") && dict.ContainsKey("password"))
                                {
                                    username = dict["username"] as string;
                                    if (!string.IsNullOrWhiteSpace(username))
                                    {
                                        string line = string.Format("{0}.{1}", username, dict["password"]);
                                        string valid = mPass.FirstOrDefault(x => x == line);
                                        ok = !string.IsNullOrWhiteSpace(valid);
                                    }
                                }

                                result = @"{""Ok"":false}";
                                if (ok)
                                {
                                    token = user_createToken(username);
                                    string temp = string.Empty;
                                    if (mTokens.ContainsKey(username)) mTokens.TryRemove(username, out temp);

                                    string userJson = "{}";
                                    string fileUser = app.Server.MapPath("~/data/user/" + username + ".json");
                                    if (System.IO.File.Exists(fileUser))
                                        userJson = System.IO.File.ReadAllText(fileUser);

                                    result = @"{""Ok"":true, ""Data"":" + userJson + @", ""Token"":""" + token + @"""}";
                                    mTokens.TryAdd(username, token);
                                }
                            }
                            catch { }

                            response_Write(result);
                            break;
                        case "admin":
                            break;
                        default:
                            break;
                    }
                }
            }
            catch (Exception err)
            {
                ;
            }
            return false;
        }

        private static string render_pageHtml(string html, oPage page)
        {
            string s =
                        @"<input type=""hidden"" id=""___io_site"" value=""" + page.site_id.ToString() + @"""/>" +
                        @"<input type=""hidden"" id=""___io_theme"" value=""" + page.theme + @"""/>" +
                        @"<input type=""hidden"" id=""___io_token"" value=""""/>",
                        uiJs = string.Empty,
                        key = string.Format("{0}.{1}", page.path, page.theme),
                        uis = string.Empty,
                        uiName, uiTag, uiHtml = string.Empty;
            string[] a;
            if (mSite_Modules.ContainsKey(key))
            {
                mSite_Modules.TryGetValue(key, out uis);
                if (!string.IsNullOrWhiteSpace(uis))
                {
                    a = uis.Split(';');
                    if (a.Length == 1)
                    {
                        uiName = a[0];
                        uiTag = "{{" + uiName + "}}";
                        if (mUI_Html.ContainsKey(uiName))
                            mUI_Html.TryGetValue(uiName, out uiHtml);
                        html = html.Replace(uiTag, uiHtml);
                        uiJs += @"<script src=""/ui/" + uiName.Split('.')[0] + @".js"" type=""text/javascript""></script>";
                    }
                    else
                    {
                        for (int i = 0; i < a.Length; i++)
                        {
                            uiName = a[i];
                            uiTag = "{{" + uiName + "}}";
                            if (mUI_Html.ContainsKey(uiName))
                                mUI_Html.TryGetValue(uiName, out uiHtml);
                            html = html.Replace(uiTag, uiHtml);
                            uiJs += @"<script src=""/ui/" + uiName.Split('.')[0] + @".js"" type=""text/javascript""></script>";
                        }
                    }
                }
            }

            s = s +
                @"<script src=""/io/vue.min.js"" type=""text/javascript""></script>" +
                uiJs +
                @"<script src=""/io/ui.sdk.js"" type=""text/javascript""></script>" +                
                "</body>";
            string render = html.Replace("</body>", s);
            return render;
        }

        public static void vue_initScript(HttpApplication app)
        {
            string f = app.Server.MapPath("~/public/vue.esm.min.js");
            if (File.Exists(f))
            {
                string jsVueCustomBegin = "var process = { env: { NODE_ENV: '' } };",
                    jsVueCustomEnd = ";decodeHTMLCached = function (s) { return s };",
                    js = File.ReadAllText(f);

                int pos = js.IndexOf("export default Vue");
                if (pos != -1) js = js.Substring(0, pos);

                mJsVueScript = jsVueCustomBegin + js + jsVueCustomEnd +
                    @";function vue_compileRender(html) { try { var t = Vue.compile(html); var s = t.render.toString(); var pos = s.indexOf('{'); if(pos != -1){ s = 'function()' + s.substr(pos); }; return s; }catch(e){ return 'ERR: ' + e.message; }};";

                mJsEngine = new V8ScriptEngine();
                mJsEngine.Execute(mJsVueScript);
            }
        }

        public static string jse_test1(HttpApplication app)
        {
            string text = "";
            try
            {
                string html =
                    @"<div>
                            <h1>{{title}}</h1>
                            <input type=""text"" v-model=""title"" id=""fname"" name=""fname""><br>
                    </div>";
                text = mJsEngine.Script.vue_compileRender(html) as string;
            }
            catch (Exception e)
            {
                text = e.Message;
            }
            return text;
        }

        #endregion

        #region [ SITE ]

        public static void site_Init(HttpApplication app)
        {
            string root = Path.Combine(ROOT_PATH, @"io\site");
            if (Directory.Exists(root))
            {
                var a = Directory.GetFiles(root, "*.htm");
                var fs = a.Select(x => Path.GetFileName(x)).ToArray();
                string text, name, ui;
                string[] uis = new string[] { };
                for (int i = 0; i < a.Length; i++)
                {
                    name = fs[i].Substring(0, fs[i].Length - 4);
                    text = File.ReadAllText(a[i]);
                    mSite_Html.TryAdd(name, text);

                    uis = text.Split(new string[] { "{{" }, StringSplitOptions.None)
                        .Where(ax => ax.Length > 1)
                        .Where((ax, k) => k > 0 && k < ax.Length - 2)
                        .Select(x => x.Split('}')[0].Trim())
                        .Distinct()
                        .ToArray();
                    if (uis.Length > 0)
                        mSite_Modules.TryAdd(name, string.Join(";", uis));
                }
            }
        }

        #endregion

        #region [ KIT ]

        public static void kit_Init(HttpApplication app)
        {
            List<string> listKits = new List<string>() { };
            List<string> listPaths = new List<string>() { };
            string root = Path.Combine(ROOT_PATH, @"io\kit");
            if (Directory.Exists(root))
            {
                var a = Directory.GetDirectories(root);
                mKitGroups = a.Select(x => Path.GetFileName(x)).ToArray();
                foreach (var g in a)
                {
                    string group = Path.GetFileName(g);
                    var ks = Directory.GetDirectories(g);
                    var ki = ks.Select(x => group + "_" + Path.GetFileName(x)).ToArray();
                    listKits.AddRange(ki);
                    listPaths.AddRange(ks);
                }
            }
            mKits = listKits.ToArray();

            for (int i = 0; i < mKits.Length; i++)
            {
                string kit = mKits[i], path = listPaths[i];
                var fs = Directory.GetFiles(path).Select(x => Path.GetFileName(x)).ToArray();

            }
        }

        #endregion

        #region [ UI ]

        public static void ui_Init(HttpApplication app)
        {
            List<string> listUIs = new List<string>() { };
            List<string> listPaths = new List<string>() { };
            string root = Path.Combine(ROOT_PATH, @"io\ui");
            if (Directory.Exists(root))
            {
                var a = Directory.GetDirectories(root);
                mUIGroups = a.Select(x => Path.GetFileName(x)).ToArray();
                foreach (var g in a)
                {
                    string group = Path.GetFileName(g);
                    var us = Directory.GetDirectories(g);
                    var ui = us.Select(x => group + "_" + Path.GetFileName(x)).ToArray();
                    listUIs.AddRange(ui);
                    listPaths.AddRange(us);
                }
            }
            mUIs = listUIs.ToArray();

            for (int i = 0; i < mUIs.Length; i++)
            {
                string ui = mUIs[i], path = listPaths[i];
                var a = Directory.GetFiles(path, "*.htm");
                var fs = a.Select(x => Path.GetFileName(x)).ToArray();

                string file, text;

                file = Path.Combine(ROOT_PATH, "io\\ui\\" + ui.Replace('_', '\\') + "\\method.js");
                if (File.Exists(file))
                {
                    text = "function ui_" + ui + "(){\r\n" + File.ReadAllText(file) + "\r\n}";
                    mUI_Js.TryAdd(ui, text);
                }

                for (int j = 0; j < fs.Length; j++)
                {
                    string tempName = ui + "." + fs[j].Substring(0, fs[j].Length - 4);
                    file = Path.Combine(ROOT_PATH, "io\\ui\\" + ui.Replace('_', '\\') + "\\" + fs[j]);
                    if (File.Exists(file))
                    {
                        text = File.ReadAllText(file);
                        mUI_Html.TryAdd(tempName, text);
                    }

                }
            }
        }

        #endregion
    }

    public class Global : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            self.Init(this);

            self.app_loadConfig(this);
            self.user_loadAll(this);

            self.vue_initScript(this);
            self.site_Init(this);
            self.kit_Init(this);
            self.ui_Init(this);

            self.jse_test1(this);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            self.request_Router(this);
        }
    }

}