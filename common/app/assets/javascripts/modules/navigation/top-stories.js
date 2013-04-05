define(['common', 'ajax', 'bonzo', 'reqwest'], function (common, ajax, bonzo, reqwest) {

    function TopStories() {

        // View

        this.view = {

            render: function (facets) {

                var topstoriesHeader = document.getElementById('topstories-header'),
                    $topstoriesHeader = bonzo(topstoriesHeader),
                    className = "is-off";

                topstoriesHeader.innerHTML = '<div class="headline-list headline-list--top box-indent" data-link-name="top-stories">'
                    + '<ul class="unstyled">'
                    + facets.map(function(facet) {
                        var section = facet.term;
                        return '<li class="zone-' + section + '"><p class="type-7"><a href="/' + section + '" class="zone-color">' 
                            + section.substring(0, 1).toUpperCase() + section.substring(1) 
                            + '</a></p></li>';
                    }).join('')
                    + '</ul>'
                    + '</div>';

                common.mediator.emit('modules:topstories:render');

                common.mediator.on('modules:control:change:topstories-control-header:true', function(args) {
                    $topstoriesHeader.removeClass(className);
                });

                common.mediator.on('modules:control:change', function(args) {

                    var control = args[0],
                        state = args[1];

                    if (state === false || control !== 'topstories-control-header') {
                        $topstoriesHeader.addClass(className);
                    }
                });
            }
        };

        // Bindings

        common.mediator.on('modules:topstories:loaded', this.view.render);

        // Model

        this.load = function (config) {

            reqwest({
                url: 'http://frontend-es.ophan.co.uk:9200/_search',
                type: 'json',
                method: 'post',
                data: JSON.stringify({
                    query: {
                        bool:{
                            must: [
                                {
                                    term: {
                                        browserId: 'XVfNytq5Q8SUw552IvJIZQ'
                                    }
                                }
                            ]
                        }
                    },
                    facets: {
                        sections: {
                            terms: {
                                field : 'section'
                            }
                        }
                    },
                    stats: ['frontend-dashboard'],
                    size: 0
                })
            })
            .then(
                function(resp) {
                    console.log(resp);
                    common.mediator.emit('modules:topstories:loaded', resp.facets.sections.terms);
                }, 
                function(err) {
                    console.log(err);
                }
            );
        };

    }

    return TopStories;

});
