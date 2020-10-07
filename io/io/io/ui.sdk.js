var ___IO_UI__EDIT_VC = '.___io_ui--edit-vc', ___IO_UI__EDIT_PANEL = '#___io_ui--edit-panel', ___IO_SITE = '';
var ___IO_DATA = {
    ui_edit: {
        active: false,
        id: ''
    }
};

console.log('UI.SDK...');
window.addEventListener('DOMContentLoaded', function (event) {
    if (window.jQuery) ___io_ready(); else ___io_scriptInsertHeader('/io/jquery.min.js', ___io_ready);
});

function ___io_ready() {
    $('.___io_ui--edit-icon').fadeIn(2000);

    var el = document.getElementById('___io_site');
    if (el) ___IO_SITE = el.value;
    ___io_editVcSetup();
}

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

function ___io_editAppToggle(el) {
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
                        console.log(id, '[1.1]:', vname, vc_exist);
                        if (vc_exist) {
                            var vc_info = { id: id, name: name, group: group, kit: kit, theme: theme, temp: temp_code };
                            const VueCtor = Vue.extend(window[vname]);
                            var vm = new VueCtor({
                                template: htm,
                                data: function () {
                                    var dt = {
                                        com: vc_info,
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

                                            if (!window.hasOwnProperty('___vc')) window['___vc'] = {};
                                            window.___vc[id] = vm;

                                            if (!window.hasOwnProperty('___vc_info')) window['___vc_info'] = [];
                                            window.___vc_info.push(vc_info);

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
