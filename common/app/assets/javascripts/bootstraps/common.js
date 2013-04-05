define([
    //Commmon libraries
    'common',
    'ajax',
    'modules/detect',
    'modules/userPrefs',
    //Vendor libraries
    'domReady',
    'qwery',
    //Modules
    'modules/router',
    'modules/errors',
    'modules/images',
    'modules/navigation/controls',
    'modules/navigation/top-stories',
    'modules/navigation/sections',
    'modules/navigation/search',
    'modules/related',
    'modules/popular',
    'modules/expandable',
    'modules/fonts',
    'modules/tabs',
    'modules/relativedates',
    'modules/analytics/clickstream',
    'modules/analytics/omniture',
    'modules/analytics/optimizely',
    'modules/adverts/adverts',
    'modules/cookies',
    'modules/analytics/omnitureMedia',
    'modules/debug',
    'bean',
    'reqwest'
], function (
    common,
    ajax,
    detect,
    userPrefs,

    domReady,
    qwery,

    Router,
    Errors,
    Images,
    Control,
    TopStories,
    Sections,
    Search,
    Related,
    Popular,
    Expandable,
    Fonts,
    Tabs,
    RelativeDates,
    Clickstream,
    Omniture,
    optimizely,
    Adverts,
    Cookies,
    Video,
    Debug,
    bean,
    reqwest
) {

    var modules = {

        initialiseAjax: function(config) {
            ajax.init(config.page.ajaxUrl);
        },

        attachGlobalErrorHandler: function (config) {
            var e = new Errors({
                window: window,
                isDev: config.page.isDev
            });
            e.init();
            common.mediator.on("module:error", e.log);
        },

        upgradeImages: function () {
            new Images().upgrade();
        },

        showDebug: function () {
            new Debug().show();
        },

        initialiseNavigation: function (config) {

            // the section panel
            new Sections().init();
            new Search(config).init();

            // the toolbar
            var t = new Control({id: 'topstories-control-header'}),
                s = new Control({id: 'search-control-header'}),
                n = new Control({id: 'sections-control-header'});

            t.init();
            s.init();
            n.init();

            common.mediator.on('modules:topstories:render', function(args) {
                t.show();
            });
        },

        transcludeTopStories: function (config) {
            new TopStories().load(config);
        },

        transcludeRelated: function (config){
            common.mediator.on("modules:related:load", function(){
                var relatedExpandable = new Expandable({ id: 'related-trails', expanded: false }),
                    host,
                    pageId,
                    url;

                if (config.page.hasStoryPackage) {
                    relatedExpandable.init();
                } else {
                    pageId = config.page.pageId;
                    url =  '/related/' + pageId;
                    common.mediator.on('modules:related:render', relatedExpandable.init);
                    new Related(document.getElementById('js-related'), config.switches).load(url);
                }
            });
        },

        transcludeMostPopular: function (section, edition) {
            var url = '/most-read' + (section ? '/' + section : '') + '.json',
                domContainer = document.getElementById('js-popular');

            if (domContainer) {
                new Popular(domContainer).load(url);
                common.mediator.on('modules:popular:render', function() {
                    common.mediator.emit('modules:tabs:render', '#js-popular-tabs');
                });
            }

        },

        showTabs: function() {
            var t = new Tabs().init();
        },

        loadFonts: function(config, ua) {
            if(config.switches.webFonts) {
                var fileFormat = detect.getFontFormatSupport(ua),
                    fontStyleNodes = document.querySelectorAll('[data-cache-name].initial');
                var f = new Fonts(fontStyleNodes, fileFormat);
                f.loadFromServerAndApply();
            }
        },

        showRelativeDates: function () {
            RelativeDates.init();
        },

        loadOmnitureAnalytics: function (config) {
            common.mediator.on('module:omniture:loaded', function() {
                var videos = document.getElementsByTagName("video");
                if(videos) {
                    for(var i = 0, l = videos.length; i < l; i++) {
                        var v = new Video({
                            el: videos[i],
                            config: config
                        }).init();
                    }
                }
            });

            var cs = new Clickstream({ filter: ["a", "span", "button"] }),
                o = new Omniture(null, config).init();
        },

        loadOphanAnalytics: function (config) {
            var dependOn = [config.page.ophanUrl];
            if (config.switches.optimizely === true) {
                dependOn.push('js!' + config.page.optimizelyUrl);
            }
            require(dependOn, function (Ophan) {
                if (config.switches.optimizely === true) {
                    Ophan.additionalViewData(function() {
                        return {
                            "optimizely": optimizely.readTests()
                        };
                    });
                }
                Ophan.startLog();
            });
        },

        loadAdverts: function (config) {
           
            if (config.switches.adverts) {
                Adverts.init(config);
                common.mediator.on('modules:adverts:docwrite:loaded', Adverts.loadAds);
            }
        },

        cleanupCookies: function() {
            Cookies.cleanUp(["mmcore.pd", "mmcore.srv", "mmid"]);
        }
    };

    var ready = function(config) {
        modules.showDebug();
        modules.initialiseAjax(config);
        modules.attachGlobalErrorHandler(config);
        modules.loadFonts(config, navigator.userAgent);
        modules.upgradeImages();
        modules.showTabs();

        modules.initialiseNavigation(config);
        modules.transcludeTopStories(config);

        modules.transcludeRelated(config);
        modules.transcludeMostPopular(config.page.section, config.page.edition);

        modules.showRelativeDates();
        
        
        bean.on(document.querySelector('#dh-search'), 'keyup', function(e) {
            var searchText = this.value;
            // start on 3rd character
            if (searchText.length > 2) { 
                reqwest({
                    url: 'http://content.guardianapis.com/search?format=json&q=' + searchText,
                    type: 'jsonp',
                    jsonpCallback: 'callback',
                    method: 'get',
                    success: function(resp) {
                        console.log(resp);
                        common.$g('#dh-search-result')
                            .html(
                                '<div class="headline-list headline-list--top box-indent" data-link-name="top-stories">'
                                    + '<ul class="unstyled">'
                                        + resp.response.results.map(function(result) {
                                            return '<li><p class="type-7"><a href="/' + result.id + '">' 
                                                + result.webTitle 
                                                + '</a></p></li>';
                                        }).join('')
                                    + '</ul>'
                                + '</div>'
                            );
                    }
                });
            }
        });
        bean.on(document.querySelector('#dh-search'), 'blur', function(e) {
            // small timeout, so links can be clicked on
            window.setTimeout(function() {
                common.$g('#dh-search-result')
                    .addClass('is-off');
            }, 100);
        });
        bean.on(document.querySelector('#dh-search'), 'focus', function(e) {
            common.$g('#dh-search-result')
                .removeClass('is-off');
            
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            var search = this;
            recognition.onresult = function(event) {
                search.value = event.results[0][0].transcript;
                bean.fire(search, 'keyup');
            }
            recognition.start();
        });
        
    };

    // If you can wait for load event, do so.
    var defer = function(config) {
        common.deferToLoadEvent(function() {
            modules.loadOmnitureAnalytics(config);
            modules.loadOphanAnalytics(config);
            modules.loadAdverts(config);
            modules.cleanupCookies();
        });
    };

    var init = function (config) {
        ready(config, userPrefs);
        defer(config);
    };

    return {
        init: init
    };

});
