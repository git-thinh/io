
console.log('UI.SDK...');
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    var els = document.querySelectorAll('*[name="___io_ui"]');
    els.forEach(function (el) {
        console.log(el.value, el.getAttribute('ui-name'));
    });
});
