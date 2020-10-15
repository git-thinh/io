window['___POPUP_ID'] = new Vue({
    data: function () {
        var data = window['___POPUP_ID.data'];
        console.log('data = ', data);
        return data;
    },
    computed: {
        ___id: function () {
            return '___POPUP_ID';
        },
        ___htm: function () {
            return window['___POPUP_ID.htm'];
        }
    },
    mounted: function () {
        var _self = this;
        _self.___init();
    },
    methods: {
        ___modal_onClick: function () {
            //debugger
            var _self = this, id = _self.___id;
            console.log('___modal_onClick = ', id);
        },
        ___close: function () {
            var _self = this,
                id = _self.___id;
            console.log('close = ', id);
        },
        ___init: function () {
            var _self = this,
                id = _self.___id,
                htm = _self.___htm;
            console.log('init = ', id);

            var main = document.getElementById(id + '-main');
            var fam = document.getElementById(id + '-iframe');
            if (fam && main) {
                var recMain = main.getBoundingClientRect();
                fam.style.height = (recMain.height - 35) + 'px';
                var doc = fam.contentWindow || fam.contentDocument.document || fam.contentDocument;
                doc.document.open();
                doc.document.write(htm);
                doc.document.close();
            }
        },
        ___ready: function () {
            var _self = this,
                id = _self.___id;
            console.log('ready = ', id);

            var main = document.getElementById(id + '-main');
            if (main) {
                $('#' + id + '-main').addClass('active');
                //main.className = 'active';
                //main.style.animation = id + '-fadein 2s';
                // Code for Chrome, Safari and Opera
                main.addEventListener("webkitAnimationEnd", function () { main.style.opacity = 1; });
                main.addEventListener("animationend", function () { main.style.opacity = 1; });
            }
        }
    }
});