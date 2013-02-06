define([
    "common",
    "modules/related",
    "modules/expandable",
    "modules/autoupdate",
    "modules/matchnav",
    "modules/analytics/reading",
    "modules/accordion"
], function (
    common,
    Related,
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
        }, 

        initStoryHack: function(config) {
            var url = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack.js';

            common.mediator.on('storyhack:render', function() {
                modules.initAccordion();
            });

            new Related(document.getElementById('js-storyhack'), config.switches, 'storyhack:render').load(url);

            var redundant = document.getElementById('related-trails');
            if (redundant) {
                redundant.innerHTML = '';
            }

            if (config.page.pageId === 'society/2013/feb/06/mid-staffordshire-report-sweeing-changes') {
                modules.initStoryHackInlines(config);
            }

        },

        initStoryHackInlines: function(config) {
            var url1 = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack.js',
                url2 = 'https://s3-eu-west-1.amazonaws.com/aws-frontend-story-telling/story-hack.js',
                paras = common.$g('.article-body > p');

            if (paras[2]) {
                common.$g(paras[2]).after('<div id="js-inline-1" class="js-inline">INLINE TEST 1</div>')
                new Related(document.getElementById('js-inline-1'), config.switches, 'storyhack:inline-1:render').load(url1);
            }
            if (paras[5]) {
                common.$g(paras[5]).after('<div id="js-inline-2" class="js-inline">INLINE TEST 2</div>')
                new Related(document.getElementById('js-inline-2'), config.switches, 'storyhack:inline-1:render').load(url2);
            }
        } 
    };

    var ready = function(config) {

        var storyHackTag = 'Mid Staffordshire NHS Trust',
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

