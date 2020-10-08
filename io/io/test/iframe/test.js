
function pop_famInit(id) {
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


function pop_famCall() {
    var id = 'pop-' + (new Date()).getTime();
    fetch('/view/test/test.htm').then(function (r1) { return r1.text(); }).then(function (htm) {
        htm = htm.split('___POPUP_ID').join(id);
        var el = new DOMParser().parseFromString(htm, 'text/html').body.childNodes[0];
        document.body.appendChild(el);
        pop_famInit(id);
    });
}

function pop_famIndicator(id, visable) {
    var indicator = document.getElementById(id + '-indicator');
    if (indicator) {
        indicator.style.display = visable == true ? 'inline-block' : 'none';
    }
}

function pop_famMainShow(id, visable) {
    var main = document.getElementById(id + '-main');
    if (main) {
        main.style.display = visable == true ? 'inline-block' : 'none';
    }
}

function pop_famReady(id) {
    var main = document.getElementById(id + '-main');
    if (main) {
        main.className = 'active';
        //main.style.animation = id + '-fadein 2s';
        // Code for Chrome, Safari and Opera
        main.addEventListener("webkitAnimationEnd", function () { main.style.opacity = 1; });
        main.addEventListener("animationend", function () { main.style.opacity = 1; });
    }
}

pop_famCall();