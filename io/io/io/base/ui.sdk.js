var ___IO_UI__EDIT_VC = '.___io_ui--edit-vc',
    ___IO_UI__EDIT_PANEL = '#___io_ui--edit-panel',
    ___IO_SITE = '',
    ___IO_VC = [];
var ___IO_DATA = {
    ui_edit: {
        active: false,
        id: ''
    }
};

console.log('UI.SDK...');
window.addEventListener('DOMContentLoaded', function (event) {
    if (window.jQuery) ___io_tabInit(); else ___io_scriptInsertHeader('/io/lib/jquery.min.js', ___io_tabInit);
});

function ___io_scriptInsertHeader(pUrl, pCallback, pId) {
    if (pUrl && pUrl.length > 0) {
        var script = document.createElement('script');
        script.onload = function () {
            if (pCallback) pCallback({ Id: pId, Ok: true, Url: pUrl });
        };
        script.setAttribute('src', pUrl);
        if (pId) script.setAttribute('id', pId);
        document.head.appendChild(script);
    } else if (pCallback) pCallback({ Ok: false, Url: pUrl });
}

//-----------------------------------------------------------

function ___io_tabInit() {
    var el = document.getElementById('___io_site');
    if (el) ___IO_SITE = el.value;
    ___io_tabLoadComponent();
}

function ___io_tabLoadComponent() {
    ___IO_VC = [];
    var els = document.querySelectorAll('*[name="___io_ui"]'),
        counter = els.length;
    els.forEach(function (el_, i_) {
        var name = el_.getAttribute('ui-name'),
            id = el_.getAttribute('ui-id');
        if (id && name) {
            ///console.log('#tabInit: ' + id, name);
            var el = $(el_).next().get(0);
            if (el) {
                el.id = id;
                ___io_vcInit(id, function (ok) {
                    console.log('#tabLoadComponent: ' + id, name, ok);
                    counter--;
                    if (counter === 0) {
                        console.log('#tabLoadComponent: DONE = ', ___IO_VC);
                        ___io_tabReady();
                    }
                });
            }
        }
    });
}

function ___io_tabReady() {
    ___io_scriptInsertHeader('/io/theme/bootstrap-500/dist/js/bootstrap.bundle.min.js', function () {
        $('.___io_ui--edit-icon').fadeIn(1000);
        console.log('#tabReady: DONE...');
    });
}

//-----------------------------------------------------------


function ___io_editAppToggle_bak(el) {
    if (el) {
        if (___IO_DATA.ui_edit.active) {
            ___IO_DATA.ui_edit.active = false;
            $(el).removeClass('active');
            $(document.body).removeClass('___io_ui--edit-vc');
            $(___IO_UI__EDIT_VC).hide();
            ___io_editVcClean();
        } else {
            ___IO_DATA.ui_edit.active = true;
            $(el).addClass('active');
            $(document.body).addClass('___io_ui--edit-vc');
            $(___IO_UI__EDIT_VC).show();
        }
    }
}

function ___io_editAppToggle(el) {
    if (el) {
        if (___IO_DATA.ui_edit.active) {
            ___IO_DATA.ui_edit.active = false;
            $(el).removeClass('active');
            $(document.body).removeClass('___io_ui--edit-vc');
        } else {
            ___IO_DATA.ui_edit.active = true;
            $(el).addClass('active');
            $(document.body).addClass('___io_ui--edit-vc');
            ___io_famPopupInit('widget', 'fomantic-ui', '1');
        }
    }
}

function ___io_vcGetThumbnailAll(callback) {
    var po = [];


    var els = document.querySelectorAll('*[name="___io_ui"]'),
        counter = els.length;
    els.forEach(function (el_, i_) {
        var name = el_.getAttribute('ui-name'),
            id = el_.getAttribute('ui-id');
        if (id && name) {
            var el = document.getElementById(id);
            if (el) {
                console.log(name, id);
                domtoimage.toPng(node)
                    .then(function (dataUrl) {
                        var img = new Image();
                        img.src = dataUrl;
                        document.body.appendChild(img);
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
            }
        }
    });


}

//-----------------------------------------------------------

function ___io_editVcSetup() {
    var els = document.querySelectorAll('*[name="___io_ui"]'),
        counter = els.length;
    els.forEach(function (el_, i_) {
        var name = el_.getAttribute('ui-name'),
            id = el_.getAttribute('ui-id');
        if (id && name) {
            console.log(name, id);

            var el = $(el_).next().get(0);
            if (el) {
                el.id = id;

                ___io_vcInit(id, function (ok) {
                    console.log(id, '[INIT_END]', ok);

                    ////////////var el = document.getElementById(id);
                    ////////////var prevIt = $('#2').prev();
                    ////////////console.log(id, el.id);

                    ////////////el.style.animation = 'fadein 1s';
                    ////////////// Code for Chrome, Safari and Opera
                    ////////////el.addEventListener("webkitAnimationEnd", function () { el.style.opacity = 1; });
                    ////////////el.addEventListener("animationend", function () { el.style.opacity = 1; });

                    //////////var r1 = el.getBoundingClientRect();
                    ////////////debugger;
                    ////////////console.log(name, id, r1);
                    //////////el_.style.left = r1.left + 'px';
                    //////////el_.style.top = r1.top + 'px';
                    //////////el_.style.width = r1.width + 'px';
                    //////////el_.style.height = r1.height + 'px';

                    counter--;
                    if (counter === 0) {
                        console.log('DONE...');
                        ___io_scriptInsertHeader('/io/theme/bootstrap-500/dist/js/bootstrap.bundle.min.js');
                    }
                });
            }

        }
    });
}

function ___io_editVcClean() {
    ___IO_DATA.ui_edit.id = '';
}

function ___io_editVcChose(el_) {
    if (el_) {
        var name = el_.getAttribute('ui-name'),
            id = el_.getAttribute('ui-id'),
            group = el_.getAttribute('ui-group'),
            kit = el_.getAttribute('ui-kit'),
            theme = el_.getAttribute('ui-theme'),
            temp_code = el_.getAttribute('ui-temp'),
            s = '';
        if (name && id) {
            $(___IO_UI__EDIT_PANEL).addClass('active');
            var vcf = document.getElementById(id + '--config');
            console.log('EDIT_VC: ', ___IO_DATA.ui_edit.id, id, name);
            if (vcf == null) {
                ___IO_DATA.ui_edit.id = id;
                $(___IO_UI__EDIT_VC).removeClass('active');
                $(el_).addClass('active');

                s = '<div class="___io_ui--edit-panel--main active" id="' + id + '--config"></div>';
                $(___IO_UI__EDIT_PANEL).append(s);

                //___io_vcInit(id);
            } else {
                if (___IO_DATA.ui_edit.id != id) $('.___io_ui--edit-panel--main').removeClass('active');
                $(vcf).addClass('active');
            }
        }
    }
}

//-----------------------------------------------------------

function ___io_vcInit(id, callback) {
    var el_ = document.querySelector('*[ui-id="' + id + '"]');
    if (el_) {
        var name = el_.getAttribute('ui-name'),
            group = el_.getAttribute('ui-group'),
            kit = el_.getAttribute('ui-kit'),
            theme = el_.getAttribute('ui-theme'),
            temp_code = el_.getAttribute('ui-temp'),
            s = '';
        if (name && id) {
            var vcItem = {
                id: id,
                name: name,
                group: group,
                kit: kit,
                theme: theme,
                temp: temp_code,
                type: 'main-inline',
                vue: false,
                position: {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                },
                image: {
                    width: 0,
                    height: 0,
                    url: ''
                }
            };
            ___IO_VC.push(vcItem);

            var url = '/io/ui/' + group + '/' + kit + '/' + theme + '--' + temp_code + '.htm';
            var urlConfig = '/io/ui/' + group + '/' + kit + '/' + group + '_' + kit + '.json';
            var json = '/public/' + ___IO_SITE + '/' + group + '_' + kit + '--' + theme + '.json';
            //console.log(url);
            //console.log(json);
            fetch(url).then(function (r1) { return r1.text(); }).then(function (htm) {
                //console.log(id, htm);
                fetch(urlConfig).then(function (r2) { return r2.json(); }).then(function (cf_com) {
                    //console.log(id, cf_com);
                    fetch(json).then(function (r3) { return r3.json(); }).then(function (data) {
                        ////////var dupNode = document.getElementById("foo").cloneNode(false);
                        //////var vc_new = new DOMParser().parseFromString(htm, 'text/html').body.childNodes[0];
                        //////vc.parentNode.replaceChild(vc_new, vc);

                        var vname = '___vc_' + group + '_' + kit, vc_exist = window.hasOwnProperty(vname);
                        //console.log(id, '[1.1]:', vname, vc_exist);
                        if (vc_exist) {
                            const VueCtor = Vue.extend(window[vname]);
                            var vm = new VueCtor({
                                template: htm,
                                data: function () {
                                    vcItem.vue = true;
                                    var dt = {
                                        com: vcItem,
                                        data: data
                                    };
                                    var keys = Object.keys(cf_com);
                                    keys.forEach(function (key) { dt[key] = cf_com[key]; });
                                    //console.log(dt);
                                    return dt;
                                },
                                computed: {
                                    ___self: function () { return window[id]; }
                                },
                                mounted: function () {
                                    var _self = this, vc_el = _self.$el;
                                    vc_el.id = id;
                                    $(vc_el).addClass(name);
                                    Vue.nextTick(function () {
                                        var vc = document.getElementById(id);
                                        if (vc) {
                                            vc.parentNode.replaceChild(vm.$el, vc);

                                            window[id] = _self;

                                            //if (window[vname].mounted) window[vname].mounted();

                                            if (callback) callback(true);
                                        }
                                    });
                                },
                                methods: {
                                }
                            }).$mount();
                        }
                        else if (callback) callback(true);
                    }).catch(function () {
                        if (callback) callback(false);
                    });
                }).catch(function () {
                    if (callback) callback(false);
                });
            }).catch(function () {
                if (callback) callback(false);
            });
        }
    }
}

//-----------------------------------------------------------

function ___io_famPopupInit(comName, themeName, tempName) {
    var id = 'pop-' + (new Date()).getTime();
    fetch('/io/base/ui.iframe-pop.htm').then(function (r1) { return r1.text(); }).then(function (pop) {
        pop = pop.split('___POPUP_ID').join(id);
        var el = new DOMParser().parseFromString(pop, 'text/html').body.childNodes[0];
        document.body.appendChild(el);

        var main = document.getElementById(id + '-main');
        var fam = document.getElementById(id + '-iframe');
        if (fam && main) {
            var urlTemp = '/io/ui/iframe/' + comName + '/' + themeName + '--' + tempName + '.htm';
            fetch(urlTemp).then(function (r1) { return r1.text(); }).then(function (htm) {
                var recMain = main.getBoundingClientRect();
                fam.style.height = (recMain.height - 35) + 'px';
                htm = htm.split('___POPUP_ID').join(id);
                var doc = fam.contentWindow || fam.contentDocument.document || fam.contentDocument;
                doc.document.open();
                doc.document.write(htm);
                doc.document.close();
            });
        }
    });
}

function ___io_famInit(id) {
    console.log('FAM_INT: ...');
    var main = document.getElementById(id + '-main');
    var fam = document.getElementById(id + '-iframe');
    if (fam && main) {
        fetch('/view/test/fam.htm').then(function (r1) { return r1.text(); }).then(function (htm) {
            var recMain = main.getBoundingClientRect();
            fam.style.height = (recMain.height - 35) + 'px';
            //console.log('FAM_INT: ', recMain);

            htm = htm.split('___POPUP_ID').join(id);

            //_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
            //var _temp = _.template(temp);
            //var htm = _temp({ UIKIT_HOST: UIKIT_HOST });

            var doc = fam.contentWindow || fam.contentDocument.document || fam.contentDocument;
            doc.document.open();
            doc.document.write(htm);
            doc.document.close();
            //if (IS_IE11) {
            //    doc = fam.contentWindow || fam.contentDocument.document || fam.contentDocument;
            //    doc.document.write(htm);
            //}            

            //var dom = new DOMParser().parseFromString(htm, 'text/html'),
            //    head = dom.head.childNodes[0],
            //    body = dom.body.childNodes[0];
            //document.body.appendChild(el);
        });
    }
}


function ___io_famIndicator(id, visable) {
    var indicator = document.getElementById(id + '-indicator');
    if (indicator) {
        indicator.style.display = visable == true ? 'inline-block' : 'none';
    }
}

function ___io_famMainShow(id, visable) {
    var main = document.getElementById(id + '-main');
    if (main) {
        main.style.display = visable == true ? 'inline-block' : 'none';
    }
}

function ___io_famReady(id) {
    var main = document.getElementById(id + '-main');
    if (main) {
        main.className = 'active';
        //main.style.animation = id + '-fadein 2s';
        // Code for Chrome, Safari and Opera
        main.addEventListener("webkitAnimationEnd", function () { main.style.opacity = 1; });
        main.addEventListener("animationend", function () { main.style.opacity = 1; });
    }
}
