
function fam_pageReady(id) {
    console.log('IFRAME: DOM fully loaded and parsed = ', id);

    $('.ui.dropdown').dropdown();

    if (window.parent && window.parent.___io_famReady) {
        window.parent.___io_famReady(id);
    }
}

