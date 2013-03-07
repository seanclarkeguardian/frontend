define(function() {

    var modules = {
        testWidthForIframe: function() {
            var inter = document.querySelector('.from-api-interactive');
            var width = inter.getAttribute('data-interactive-width');
            if (inter.offsetWidth > width) {
                var iframe = document.createElement('iframe');
                iframe.frameBorder = 0;
                iframe.width = width;
                iframe.height = inter.getAttribute('data-interactive-height');
                iframe.src = inter.getAttribute('data-interactive-src');
                // TODO: Do this in one paint.
                inter.innerHTML = "";
                inter.appendChild(iframe);
            }
        }
    };

    var init = function(req, config) {
        console.log('init interactive');
        modules.testWidthForIframe();
    };

    return {
        init: init
    };
});
