
var ___vc_form_checkout = {
    mounted: function () {
        console.log('------->___vc_form_checkout.mounted = ', this.$data.com.id);

        //// Fetch all the forms we want to apply custom Bootstrap validation styles to
        //var forms = document.querySelectorAll('.needs-validation')

        //// Loop over them and prevent submission
        //Array.prototype.slice.call(forms).forEach(function (form) {
        //    form.addEventListener('submit', function (event) {
        //        if (!form.checkValidity()) {
        //            event.preventDefault()
        //            event.stopPropagation()
        //        }

        //        form.classList.add('was-validated')
        //    }, false)
        //});

    },
    methods: {
        form_checkValidity: function (event) {
            if (event) {
                var el = event.target;
                //console.log('form_checkValidity: ', el);
                if (el) {
                    var form = el.closest('form');
                    console.log('form_checkValidity: ', form);
                    if (form) {
                        var bootstrapEnabled = (typeof $().modal === 'function');
                        if (bootstrapEnabled) {
                            if (!form.checkValidity()) {
                                event.preventDefault()
                                event.stopPropagation()
                            }

                            form.classList.add('was-validated')
                        } else {
                            alert('bootstrap JS loading...')
                        }
                    }
                }
            }
        }
    }
};


