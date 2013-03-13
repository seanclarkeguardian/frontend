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

        this.els = {};

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
                common.$g('body').append(tpl);
            },

            appendBtns: function() {
                var nav = document.querySelector('.story-nav');

                for(var section in that.els) {
                    var el = document.createElement('a');
                    el.href = "#" + that.els[section].id;
                    el.innerHTML = that.els[section].name;
                    el.className = "story-nav-btn ." + that.els[section].id;
                    console.log(el);
                    common.$g(nav).append(el);
                }
            },

            toggle: function(el) {
                var $ = common.$g;
                $('.story-nav-btn').hide();
                $('.story-nav-btn').removeClass('left');
                $('.story-nav-btn').removeClass('right');

                if(el.left) {
                    var left = document.querySelector('.story-nav-btn.' + that.els[el.left].id)
                    $(left).addClass('left');
                    $(left).show();
                }

                if(el.right) {
                    var right = document.querySelector('.story-nav-btn.' + that.els[el.right].id);
                    $(right).addClass('right');
                    $(right).show();
                }
            }
        };

        this.init = function() {

            setTimeout(function(){
                that.view.show();
                that.view.appendBtns();
            }, 5000);

            // Check every second if page has scrolled
            var currentScroll = window.pageYOffset;
            setInterval(function() {
                //If scroll position has moved
                if (window.pageYOffset !== currentScroll) {
                    currentScroll = window.pageYOffset;

                    //Latest
                    if(that.els["latest"].isInViewport() && !that.els["background"].isInViewport()) {
                        common.$g('.story-nav').removeClass('h');
                        that.view.toggle(that.els["latest"]);
                    }

                    if(that.els["background"].isInViewport() && !that.els["latest"].isInViewport()) {
                        that.view.toggle(that.els["background"]);
                    }
                }

            }, 1000)

        };

    }

    return Navigation;

});
