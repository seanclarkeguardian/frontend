define([
    'common',
    'bonzo',
    'bean',
    'modules/detect',
    'modules/sticky'
], function (
    common,
    bonzo,
    bean,
    detect,
    Sticky
) {

    function Sections() {

        var sectionsHeader = document.getElementById('sections-header'),
            sectionsNav = document.querySelector('.nav--global'),
            $sectionsHeader = bonzo(sectionsHeader),
            className = 'is-off',
            that = this;

        this.view = {
            bindings : function() {
                common.mediator.on('modules:control:change:sections-control-header:true', function(args) {
                    $sectionsHeader.removeClass(className);
                    $sectionsHeader.focus();
                });

                common.mediator.on('modules:control:change', function(args) {

                    var control = args[0],
                        state = args[1];

                    if (state === false || control !== 'sections-control-header') {
                        $sectionsHeader.addClass(className);
                    }

                });

                bean.on(window, 'resize', common.debounce(function(e){
                    var layoutMode = detect.getLayoutMode();

                    bonzo(sectionsHeader).addClass(className);

                    if(layoutMode !== 'mobile') {
                        that.view.hideColumns();
                    } else {
                        that.view.showColumns();
                    }
                }, 200));
            },

            initShuffler : function() {

                // This is just a hack day hack. Needs to be some kinda animated slider thing.

                var shuffle = function () {
                    var items = document.querySelectorAll('.nav--global .nav__item'),
                        item  = bonzo(items[0]).detach();

                    bonzo(items[items.length - 1]).after(item);
                };

                bean.on(document.querySelector('.nav--global .control'), 'click', function(){
                    for( var i = 0; i < 4; i += 1) {
                        shuffle();
                    }
                });
            },

            showColumns : function() {
                common.$g('.nav__item', sectionsHeader).removeClass('h');
                common.$g('.nav', sectionsHeader).removeClass('nav--stacked').addClass('nav--columns');
            },

            hideColumns :  function() {
                common.$g('.nav', sectionsHeader).removeClass('nav--columns').addClass('nav--stacked');

                var visibleItems = [],
                popupItems = common.$g('.nav__item', sectionsHeader).removeClass('h');

                common.$g('.nav__item', sectionsNav).each(function(e) {
                    if(bonzo(e).offset().top < 160) {
                        visibleItems.push(e);
                    }
                });

                for(var i=0, l=visibleItems.length; i < l; i++) {
                    bonzo(popupItems[i]).addClass('h');
                }
            }
        };

        this.init = function () {
            var layoutMode = detect.getLayoutMode();
            this.view.bindings();

            if(layoutMode !== 'mobile') {
                this.view.hideColumns();
                this.view.initShuffler();
                var s = new Sticky();
            }
        };
     }

    return Sections;

});
