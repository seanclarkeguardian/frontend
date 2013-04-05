define(['bean', 'bonzo'], function ( bean, bonzo) {

    var Sticky = function (config) {

        var els = (config.context ? config.context : document).querySelectorAll('.sticky');
        
        [].forEach.call(els, function(el) {
            var height = bonzo(el).offset().height,
                vPos = bonzo(el).offset().top,
                vScroll = 0,
                vFixed = false;

            bean.add(window, 'scroll', function (e) {
                vScroll = window.pageYOffset || document.documentElement.scrollTop;

                if( !vFixed && vScroll >= vPos) {
                    bonzo(el).addClass('stuck');
                    vFixed = true;
                } else if( vFixed && vScroll < vPos) {
                    bonzo(el).removeClass('stuck');
                    vFixed = false;
                }
            });
        });
    };

    return Sticky;
});
