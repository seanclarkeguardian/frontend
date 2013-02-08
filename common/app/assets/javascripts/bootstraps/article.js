define([
    "common",
    "modules/related",
    "modules/expandable",
    "modules/autoupdate",
    "modules/matchnav",
    "modules/analytics/reading",
    "modules/accordion",
    "modules/gallery"
], function (
    common,
    Related,
    Expandable,
    AutoUpdate,
    MatchNav,
    Reading,
    Accordion,
    Gallery
) {

    var modules = {

        matchNav: function(config){
            var teamIds = config.referencesOfType('paFootballTeam');
            var isRightTypeOfContent = config.hasTone("Match reports") || config.hasTone("Minute by minutes");

            if(teamIds.length === 2 && isRightTypeOfContent){
                var url = "/football/api/match-nav/";
                            url += config.webPublicationDateAsUrlPart() + "/";
                            url += teamIds[0] + "/" + teamIds[1];
                            url += "?currentPage=" + encodeURIComponent(config.page.pageId);
                new MatchNav().load(url);
            }
        },

        related: function(config){
            var host = config.page.coreNavigationUrl,
                pageId = config.page.pageId,
                edition = config.page.edition;

            var url =  host + '/related/' + pageId;
            common.mediator.emit("modules:related:load", [url]);
        },

        initLiveBlogging: function(switches) {
            var a = new AutoUpdate({
                path: window.location.pathname,
                delay: 60000,
                attachTo: document.querySelector(".article-body"),
                switches: switches
            }).init();
        },

        logReading: function(config) {
            var wordCount = config.page.wordCount;
            if(wordCount !== "") {
                
                var reader = new Reading({
                    id: config.page.pageId,
                    wordCount: parseInt(config.page.wordCount, 10),
                    el: document.querySelector('.article-body'),
                    ophanUrl: config.page.ophanUrl
                });

                reader.init();
            }
        },

        initAccordion: function() {
            if(document.querySelector('.accordion')) {
                var a = new Accordion();
            }
        },

        initStoryHack: function(config) {
            var eventBlock = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack.js',
                navBlock = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack-nav.js';

            common.$g('.zone-color', '.article-zone.type-1').text('Mid Staffs Scandal');

            common.mediator.on('storyhack:render', function() {
                modules.initAccordion();
                modules.augmentGallery();
            });

            new Related(document.getElementById('js-storyhack'), config.switches, 'storyhack:render').load(eventBlock);
            new Related(document.getElementById('js-storyhack-nav'), config.switches, 'storynav:render').load(navBlock);

            common.$g('#related-trails').remove();
            common.$g('h3.type-2.article-zone').remove();
        },

        initStoryHackInlines: function(config) {
            var blocks = [
                    {para:4, url:'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack-inline-1.js'},
                    {para:10, url:'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack-inline-2.js'},
                    {para:22, url:'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack-inline-3.js'}
                ],
                paras = common.$g('.article-body > p:not(:empty)');

            blocks.map(function(b,i){
                if (paras[b.para]) {
                    common.$g(paras[b.para]).after('<div id="js-inline-' + i + '" class="js-inline"></div>');
                    b.loader = new Related(document.getElementById('js-inline-' + i), config.switches).load(b.url);
                }
            });
        },

        augmentGallery: function() {
            var g = new Gallery().init();
        }
    };

    var ready = function(config) {

        var storyHackTag = 'Mid Staffordshire NHS Trust',
            storyHackId  = 'society/2013/feb/06/mid-staffordshire-report-sweeing-changes',
            keywords = (config.page && config.page.keywords) ? config.page.keywords.split(',') : [],
            doStoryHack = false;

        keywords.map(function(k){
            if (k === storyHackTag) {
                doStoryHack = true;
            }
        });

        if (config.page.isLive) {
            modules.initLiveBlogging(config.switches);
        }

        if (doStoryHack) {
            modules.initStoryHack(config);
            if (config.page.pageId === storyHackId) {
                modules.initStoryHackInlines(config);
            }
        } else if (config.page.showInRelated) {
            modules.related(config);
        }

        if(config.page.section === "football") {
            modules.matchNav(config);
        }
    };

    // If you can wait for load event, do so.
    var defer = function(config) {
        common.deferToLoadEvent(function() {
            modules.logReading(config);
        });
    };

    var init = function (req, config) {
        ready(config);
        defer(config);
    };


    return {
        init: init
    };

});

