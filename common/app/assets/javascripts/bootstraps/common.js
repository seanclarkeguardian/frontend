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
    'modules/related',
    'modules/popular',
    'modules/expandable',
    'modules/fonts',
    'modules/tabs',
    'modules/relativedates',
    'modules/analytics/clickstream',
    'modules/analytics/omniture',
    'modules/adverts/adverts',
    'modules/cookies',
    'modules/editionswipe',
    'modules/search',
    'modules/analytics/omnitureMedia'
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
    Related,
    Popular,
    Expandable,
    Fonts,
    Tabs,
    RelativeDates,
    Clickstream,
    Omniture,
    Adverts,
    Cookies,
    editionSwipe,
    Search,
    Video
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

        upgradeImages: function (config) {
            new Images().upgrade(config);
        },

        initialiseNavigation: function (config) {

            // the section panel
            new Sections().init();

            // the toolbar
            var t = new Control({id: 'topstories-control-header'}),
                s = new Control({id: 'sections-control-header'});

            t.init();
            s.init();

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

        loadFonts: function(config, ua, prefs) {
            var showFonts = false;
            if(config.switches.webFonts) {
                showFonts = true;
            }

            var fileFormat = detect.getFontFormatSupport(ua),
                fontStyleNodes = document.querySelectorAll('[data-cache-name].initial');

            var f = new Fonts(fontStyleNodes, fileFormat);
            if (showFonts) {
                f.loadFromServerAndApply();
            } else {
                f.clearAllFontsFromStorage();
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
            require([config.page.ophanUrl], function (Ophan) {
                Ophan.startLog();
            });
        },

        loadAdverts: function (config) {
            Adverts.init(config);

            common.mediator.on('modules:adverts:docwrite:loaded', Adverts.loadAds);
        },

        cleanupCookies: function() {
            Cookies.cleanUp(["mmcore.pd", "mmcore.srv", "mmid"]);
        },

        initEditionSwipe: function(config) {
            var opts = {
                el: '#swipepages',
                ajaxStrip: [
                    [/^[\s\S]*<div id=\"swipepage-1\">/, ''],
                    [/<\/div swipepage-1>[\s\S]*$/, '']
                ],
                widthGuess: 1,
                afterShow: function(configSwipe) {
                    config.swipe = configSwipe;
                    onPaneVisible(config);
                }
            };
            editionSwipe(opts);
        },

        initialiseSearch: function(config) {
            var s = new Search(config);
            common.mediator.on('modules:control:change:sections-control-header:true', function(args) {
                s.init();
            });
        }
    };

    var onPaneVisible = function(config) {
        var edition;

        ready(config, userPrefs);
        defer(config);

        if( config.swipe.initiatedBy === 'initial' || config.swipe.initiatedBy === 'link') {
            edition = [];
            // First page in edition is the referrer
            edition.push(common.urlPath(config.swipe.referrer));
            // Second page in edition is the current page
            common.pushIfNew(window.location.pathname, edition);
            // Remaining pages are scraped from trails
            common.$g('li[data-link-name="trail"] a', config.swipe.visiblePane).each(function(el, index) {
                common.pushIfNew(el.pathname, edition);
            });
            if (edition.length >= 3) {
                config.swipe.api.setEdition(edition);
            }
        }
    };

    var ready = function(config) {
        modules.upgradeImages(config); // Swipe: working
        modules.showTabs();

        modules.initialiseNavigation(config);
        modules.transcludeTopStories(config);

        modules.transcludeRelated(config);
        modules.transcludeMostPopular(config.page.section, config.page.edition);

        modules.initialiseSearch(config);

        modules.showRelativeDates();
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
        modules.initialiseAjax(config);
        modules.attachGlobalErrorHandler(config);
        modules.loadFonts(config, navigator.userAgent, userPrefs);
        modules.initEditionSwipe(config);
    };

    return {
        init: init
    };

});
