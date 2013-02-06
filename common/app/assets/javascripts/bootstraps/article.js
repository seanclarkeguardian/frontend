define([
    "common",

    "modules/expandable",
    "modules/autoupdate",
    "modules/matchnav",
    "modules/analytics/reading",
    "modules/accordion"
], function (
    common,
    Expandable,
    AutoUpdate,
    MatchNav,
    Reading,
    Accordion
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
        }
    };

    var ready = function(config) {

        var storyHackTag = 'Mid Staffordshire NHS Trust',
            storyHackUrl = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack.js',
            keywords = (config.page && config.page.keywords) ? config.page.keywords.split(',') : [],
            doStoryHack = false;

        keywords.map(function(k){
            if (k === storyHackTag) doStoryHack = true;
        });

        if (config.page.isLive) {
            modules.initLiveBlogging(config.switches);
        }

        if (doStoryHack) {
            common.mediator.on('modules:related:render', function() {
                modules.initAccordion();
            });
            common.mediator.emit("modules:storyhack:load", [storyHackUrl]);
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

