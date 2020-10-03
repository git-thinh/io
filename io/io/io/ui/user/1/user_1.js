const Hello = {
    props: ['user'],
    template: `<div class="nav-item dropdown ui_user_1" data-ui="ui_user_1" :data-id="user.username">
    <button type="button" class="nav-link dropdown-toggle" @click="domything">{{user.full_name}} - Do my thing!</button>
    <div class="dropdown-menu">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#" data-click="logout">SingOut</a>
    </div>
</div>`,
};

// create component constructor
const HelloCtor = Vue.extend(Hello);
const vm = new HelloCtor({
    propsData: {
        user: {
            username: 'thinh',
            full_name: 'Nguyen Van Thinh',
        }
    },
    methods: {
        domything() {
            console.log('Method was called')
        }
    }
});

//vm.$mount('#ui_user_1');

var getContent = function () {
    const vueComponent = new Vue({
        template: '<div><button type="button" @click="domything">Do my thing!</button></div>',
        methods: {
            domything() {
                console.log('Method was called')
            }
        }
    });
    return vueComponent.$mount().$el;
};

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    var f1 = getContent();
    console.log(f1);
    var el = document.getElementById('ui_user_2');
    console.log(el);
    el.appendChild(f1);


    var f2 = vm.$mount().$el;
    console.log(f2);
    var el2 = document.getElementById('ui_user_1');
    console.log(el2);
    el2.appendChild(f2);
});
