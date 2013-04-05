define(['common', 'ajax', 'bonzo', 'reqwest', 'bean'], function (common, ajax, bonzo, reqwest, bean) {
    
    function objectifyCookies(cookieString) {
        var cookies = {};
        cookieString.split(/\s*;\s*/).forEach(function(entry) {
            var cookieBits = entry.split('=');
            cookies[cookieBits[0]] = cookieBits[1] 
        });
        return cookies;
    }

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
                        return '<li class="foo zone-' + section + '"><p class="type-7"><a href="/' + section + '" class="section zone-color">' 
                            + section.substring(0, 1).toUpperCase() + section.substring(1) 
                            + '</a></p></li>';
                    }).join('')
                    + '</ul>'
                    + '</div>';
                
                // top stories hover
                bean.on(topstoriesHeader, 'mouseover', 'a.section', function(e) {
                    var link = bonzo(this),
                        ul = bonzo(bonzo(link.parent()).next());
                    if (ul.length !== 0) {
                        return ul.show();
                    }
                    
                    var section = link.text().toLowerCase(),
                        dtTo = new Date().getTime();
                    // pull in most popular story for that section (in the last minute)
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
                                                section: section
                                            }
                                        },
                                        {
                                            range:{
                                                dt: {
                                                    from: dtTo - (60 * 1000),
                                                    to: dtTo
                                                }
                                            }
                                        },
                                        {
                                            term: {
                                                isContent: true
                                            }
                                        }
                                    ]
                                }
                            },
                            facets: {
                                stories: {
                                    terms: {
                                        field : 'path',
                                        size : 5
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
                            var results = resp.facets.stories.terms;
                            if (results.length === 0) {
                                return;
                            }
                            bonzo(link.parent()).after(
                                '<ul style="clear:left; position:absolute; background-color:rgba(255,255,255,0.9); box-sizing:border-box; width:100%">'
                                + results.map(function(result) {
                                    var url = result.term,
                                        title = url.split('/').reverse()[0].replace(/-/g, ' ');
                                    return '<li><a href="' + url + '">' 
                                        + title.substring(0, 1).toUpperCase() + title.substring(1)  
                                        + '</a></li>'
                                }).join('')
                                + '</ul>'
                            );
                        }, 
                        function(err) {
                            console.log(err);
                        }
                    );
                });
                
                // remove top stories
                bean.on(topstoriesHeader, 'mouseleave', 'li.foo', function(e) {
                    common.$g('ul', this).hide();
                });
                
                bean.on(topstoriesHeader, 'mouseover', 'a.section', function(e) {})

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
            // pull out ophan cookie
            var ophanCookie = objectifyCookies(document.cookie).bwid || 'XVfNytq5Q8SUw552IvJIZQ';
            
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
                                        browserId: ophanCookie
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
