define([
        'common',
        'bonzo',
        'modules/userPrefs'
    ],
    function (
        common,
        bonzo,
        userPrefs
    ) {

    var Rhythm = function() {
    
        var rhythmHeader = document.getElementById('rhythm-header')
          , rhythmNav = document.querySelector('.nav--global')
          , $rhythmHeader = bonzo(rhythmHeader)
          , now = new Date()
          , dayOfTheWeek = now.getDay() || 0
          , className = 'is-off';

        common.mediator.on('modules:control:change:sections-control-rhythm:true', function() {
            $rhythmHeader.removeClass(className);
        });
        
        common.mediator.on('modules:control:change:sections-control-rhythm:false', function() {
            $rhythmHeader.addClass(className);
        });

        this.init = function (c) {
        
            var dependOn = ['http://matt.chadburn.co.uk/projects/storytelling/swipe/swipe.js'];
           
            // load swipe library
            require(dependOn, function(swipe) {
                    window.slider = new swipe(
                        document.getElementById('swipable'), { callback: function(e, pos) {
                            }, startSlide: dayOfTheWeek, continuous: true } // land the user on today - Sunday = 0, Monday = 1 etc.
                    );
            })
        
        };
        
    }
    return Rhythm;
});
