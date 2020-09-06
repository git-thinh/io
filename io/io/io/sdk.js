const createPage = (name, data = {}, methods = {}, updated = () => { }) => Vue.component(name, {
    //props: ['title'],
    data: () => { title: 56789 },
    methods: methods,
    mounted() {
        console.log(this.$data);
        (new Promise((resolve) => {
            //const url = this.$route.path;
            const url = '/io/theme/bootstrap452/' + name + '.htm';
            //alert(url);
            fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                }
            ).then(response => resolve(response.text()));
        })).then(result => this.content = result);
    },
    //render: function (c) {
    //    if (this.content === '') {
    //        return;
    //    }
    //    return c(Vue.compile('<div>' + this.content + '</div>'));
    //},
    render: function (h, b, v) {
        var compile = Vue.compile(`
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#">{{title}}</a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>
        `);
        return h(compile);
    },
    updated: updated
});

var DATA = {};
DATA.user = JSON.parse(localStorage['USER']);
DATA.token = localStorage['TOKEN'];
console.log(DATA);
const state = Vue.observable({ count: 0 })

//Vue.component('kit_user_avatar', {
//    data: function () {
//        return { username: 'admin' }
//    },
//    render: function (c) {
//        //if (this.content === '') {
//        //    return;
//        //}
//        return c(Vue.compile(`
                //<div class="nav-item dropdown">
                //    <a class="nav-link dropdown-toggle" href="#">{{username}}</a>
                //    <div class="dropdown-menu">
                //        <a class="dropdown-item" href="#">Action</a>
                //        <a class="dropdown-item" href="#">Another action</a>
                //        <a class="dropdown-item" href="#">Something else here</a>
                //    </div>
                //</div>
//        `));
//    },
//});

//window.KIT_USER_AVATAR = Vue.compile('<kit_user_avatar></kit_user_avatar>');




var APP = new Vue({
    data: function () {
        return {
            KIT_USER_AVATAR: null
        };
    },
    mounted: function () {
        var _self = this;

        console.log(11111)

        const showoff = (name) => console.log(name, ' showing off');

        const about = createPage(
            'kit_user_avatar',
            DATA,
            {
                hit: () => alert('This alert already proof that I am a web developer!')
            },
            function () {
                this.$nextTick(() => {
                    //showoff(this.name)
                    console.log(33333)
                });

            }
        );
        _self.KIT_USER_AVATAR = about;

        
    }
});

APP.$mount('#app');