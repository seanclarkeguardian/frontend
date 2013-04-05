define(['bean', 'bonzo'], function ( bean, bonzo) {

    var Sticky = function (context) {

        var els = (context ? context : document).querySelectorAll('.sticky');
        
        [].forEach.call(els, function(el) {

            var pos    = 0,
                fixed  = false;

            bean.add(window, 'scroll', function (e) {

                var scroll = window.pageYOffset || document.documentElement.scrollTop;

                pos    = pos || bonzo(el).offset().top;

                if( !fixed && scroll >= pos) {
                    bonzo(el).addClass('stuck');
                    fixed = true;
                } else if( fixed && scroll < pos) {
                    bonzo(el).removeClass('stuck');
                    fixed = false;
                }
            });
        });
    };

    return Sticky;
});
