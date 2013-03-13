define([
    'common'
], function (
    common
) {

    function Navigation() {

        var tpl = "<div class='story-nav h'></div>",
            that = this;

        this.isInViewport = function(el) {
            var rect = el.getBoundingClientRect();
            return rect.top < (window.innerHeight || document.body.clientHeight) && rect.left < (window.innerWidth || document.body.clientWidth);
        };

        function Section(o) {
            this.name = o.name;
            this.id = o.id;
            this.prev = o.left,
            this.next = o.right,
            this.el = document.getElementById(this.id);
            this.isInViewport = function(){ return that.isInViewport(this.el) };
        }

        this.els = [];

        this.els["latest"] = new Section({
            name: "Latest",
            id: "story-latest",
            prev: false,
            next: "background"
        });

        this.els["background"] = new Section({
            name: "Background",
            id: "story-overview",
            prev: "latest",
            next: "agents"
        });

        this.view = {
            show: function() {

            },

            toggle: function() {
                var nav = document.querySelector('.story-nav');

            }
        };

        this.init = function() {

            setTimeout(function(){
                common.$g('body').append(tpl);
                that.view
            }, 5000);

            // Check every second if page has scrolled
            var currentScroll = window.pageYOffset;
            setInterval(function() {
                //If scroll position has moved
                if (window.pageYOffset !== currentScroll) {
                    currentScroll = window.pageYOffset;

                    //Latest
                    if(that.els["latest"].isInViewport() && !that.els["background"].isInViewport()) {
                        that.els["latest"].init();
                    }

                    if(that.els["background"].isInViewport() && !that.els["latest"].isInViewport()) {
                        that.els["background"].init();
                    }
                }

            }, 1000)

        };

    }

    return Navigation;

});
