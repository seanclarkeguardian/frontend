// Description: Edition Swipe module
// Author: Stephan Fowler

define(['swipeview', 'bean', 'bonzo', 'qwery', 'reqwest'], function(SwipeView, bean, bonzo, qwery, reqwest) {

    function $(selector, context) {
        return bonzo(qwery(selector, context));
    }

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }

    function inArray(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] === needle) {
                return i;
            }
        }
        return -1;
    }

    function isEmptyObj(obj) {
        for(var i in obj) {
            return false;
        }
        return true;
    }

    var module = function (useropts) {

        var
            // general purpose do-nothing function
            noop = function () {},

            // Configuration options.
            opts = extend(
                {
                    // Container element
                    el: undefined,

                    // Callback after a pane is loaded (including hidden panes); use for fancy js-managed rendering.
                    afterLoad: noop,

                    // Callback before any pane is made visible.
                    beforeShow: noop,

                    // Callback after a pane is made visible; use for analytics events, social buttons, etc.
                    afterShow: noop,

                    // Validator regular expression for Ajax responses.
                    ajaxRegex: '.*',

                    // Regexs for stuff that should be stripped from ajax responses, e.g. header & footer markup
                    ajaxStrip: [],

                    // Possible values for screen width. Wrt. cacheing, the fewer the better.
                    breakpoints: [481, 768, 1024],

                    // A list of paths - e.g. ["\/","\/foo\/", "\/bar\/"] - which left/right actions will step through.
                    // Set edition using this option, or in your afterShow function using api.setEdition. The latter method also allows you to change the edition mid-flow .
                    edition: [],

                    // Allow ajax+pushState behaviour (requires HTML5 History API support)
                    enablePjax: true,

                    // Allow swipe behaviour (requires CSS Transitions support)
                    enableSwipe: true,

                    // Reload content on window resize; switches the width metric to window- rather than screen-width; for testing only.
                    emulator: false,

                    // Milliseconds until edition should expire, i.e. cache should flush and/or content should reload instead of Ajax'ing. 0 => no expiry.
                    expiryPeriod: 0,

                    // CSS selector for anchors that should initiate an ajax+pushState reload.
                    linkSelector: 'a:not(.no-ajax)',

                    // The CSS selector for an element containing a data-json attribute with arbitrary data about the page.
                    pageDataSelector: '.responsive-swipe-meta',

                    // The name of the query param sent wth Ajax page-fragment requests
                    queryParam: 'frag_width',

                    // CSS selector for a spinner/busy indicator
                    loadingIndicator: undefined,

                    // The server's guess of the device width. Set this to zero if you want
                    // the initial page content to be Ajax reloaded if the device width exceeds the
                    // lowest value from the breakpoints option array.
                    widthGuess: 1024
                },
                useropts
            ),

            // Private vars
            androidVersion,
            ajaxCount = 0,
            ajaxRegex = new RegExp(opts.ajaxRegex,'g'),
            throttle,
            cache = {},
            canonicalLink = $('link[rel=canonical]'),
            initiatedBy = 'initial',
            contentArea = $(opts.el)[0],
            contentAreaTop = $(opts.el).offset().top,
            editionPos = -1,
            edition = [],
            editionLen = 0,
            editionChecksum,
            supportsHistory = false,
            supportsTransitions = false,
            inEdition = false,
            initialPage,
            initialPageRaw,
            noHistoryPush,
            visiblePane = $('#swipepages-inner > #swipepage-1', opts.el)[0],
            pageData,
            panes,
            paneNow = 1,
            paneThen = 1,
            visiblePaneMargin = 0,
            hiddenPaneMargin = 0,
            referrer = document.referrer;

        // Detect capabilities
        if (opts.enablePjax && window.history && history.pushState) {
            supportsHistory = true;
            // Revert supportsHistory for Android <= 4.0, unless it's Chrome/Firefox browser
            androidVersion = window.navigator.userAgent.match(/Android\s+([\d\.]+)/i);
            if (androidVersion && parseFloat(androidVersion[1]) <= 4.1) {
                supportsHistory = !!window.navigator.userAgent.match(/(Chrome|Firefox)/i);
            }
        }

        if (opts.enableSwipe) {
            var v = ['ms', 'Khtml', 'O', 'Moz', 'Webkit', ''];
            // Tests for vendor specific prop
            while(v.length) {
                if (v.pop() + 'Transition' in document.body.style) {
                    supportsTransitions = true;
                    break;
                }
            }
        }

        var getPageData = function () {
            try {
                var obj = $(visiblePane).find(opts.pageDataSelector).eq(0).data('pagedata');
                return obj && typeof obj === 'object' ? obj : {};
            }
            catch(e) {
                return {};
            }
        };

        if (typeof Number.prototype.mod !== 'function') {
            Number.prototype.mod = function (n) {
                return ((this % n) + n) % n;
            };
        }

        var deBounce = (function () {
            var timers = {};
            return function (fn, time, key) {
                key = key || 1;
                clearTimeout(timers[key]);
                timers[key] = setTimeout(fn, time);
            };
        }());

        var normalizeUrl = function(url) {
            var a = document.createElement('a');
            a.href = url;
            a = a.pathname + a.search;
            a = a.indexOf('/') === 0 ? a : '/' + a; // because IE doesn't return a leading '/'
            return a;
        };

        // The width. By default it's the (fixed) screen width, but could be the (variable) window width if emulator option is enabled.
        var getWidth = function () {
            if (opts.emulator) {
                getWidth = function () {
                    return $(window).width();
                };
            }
            else {
                var w = screen.width;
                getWidth = function () {
                    return w;
                };
            }
            return getWidth();
        };

        // The breakpoint, i.e. the current width rounded down to the highest value in th breakpoint array
        var getBreakpoint = function () {
            var
                i, b, ww,
                bs = opts.breakpoints,
                bl = opts.breakpoints.length;
            getBreakpoint = function () {
                ww = getWidth();
                for(i = bl-1; i >= 0; i--){
                    b = bs[i];
                    if( ww >= b ) {
                        return b;
                    }
                }
                return 0;
            };
            return getBreakpoint();
        };

        var load = function (o) {
            var
                url = o.url,
                el = o.container,
                callback = o.callback || noop,
                data = {},
                html,
                rx,
                i;
            if (url && el) {
                el.dataset = el.dataset || {};
                el.dataset.url = url;
                    
                // query cache.
                html = cache[url];

                // Is cached ?
                if (html) {
                    populate(el, html);
                    callback();
                }
                else {
                    data[opts.queryParam] = getBreakpoint();
                    el.dataset.waiting = '1';
                    reqwest({
                        url: url,
                        method: 'get',
                        type: 'html',
                        data: data,
                        success: function (html) {
                            var i;

                            // Do optional regex replaces
                            for (i in opts.ajaxStrip) {
                                rx = opts.ajaxStrip[i];
                                html = html.replace(rx[0], rx[1]);
                            }

                            if (html.match(ajaxRegex)) {
                                // Only add to DOM if this container is still due to to receive this url's content.
                                // This might not be the case if newer content has been called in since this request was made, e.g. during fast swiping.
                                if (el.dataset.url === url) {
                                    populate(el, html);
                                    cache[url] = html;
                                    callback();
                                }
                            }
                            else {
                                html = '<div class="responsive-swipe-error">Oops. That went wrong. <a class="no-ajax" href="' + url + '">Try again.</a></div>';
                                populate(el, html);
                                if (window.console) {
                                    window.console.log('WARNING! Ajax response didn\'t validate against regex: ' + opts.ajaxRegex );
                                    window.console.log('WARNING! Enable XMLHttpRequest logging in your browser, then check the responses.');
                                }
                            }
                            el.dataset.waiting = '';
                            ajaxCount += 1;
                            // Maybe flush cache
                            if (ajaxCount > 50) {
                                ajaxCount = 0;
                                cache = {};
                            }
                        },
                        error: function () {}
                    });
                    if (o.showSpinner) {
                        spinner.show();
                    }
                }
            }
        };

        var populate = function (el, html) {
            $(el).html(html);
            spinner.hide();
            opts.afterLoad(el);
        };

        // Gets redefined progressively
        var reloadContent = function (callback) {
            load({
                url: normalizeUrl(window.location.href),
                container: visiblePane,
                callback: callback
            });
        };

        // Gets redefined progressively
        var repaintContent = function () {
            opts.afterLoad(visiblePane);
        };

        bean.on(window, 'resize', function () {
            // Emulator mode: detect a window resize and re-request the content, throttled to one reload per second.
            if (opts.emulator) {
                deBounce(function () {
                    cache = {};
                    reloadContent();
                }, 1013, 'reloadContent');
            }
            // Normal mode: redraw the existing content
            else {
                repaintContent();
            }
        });

        // Make the contentArea height equal to the visiblePane height. (We view the latter through the former.)
        var updateHeight = function(){
            var height = $('*', visiblePane).offset().height; // NB visiblePane has height:100% set by swipeview, so we look within it
            if (height) {
                $(contentArea).css('height', height + visiblePaneMargin + 'px');
            }
        };

        // Fire post load actions
        var doAfterShow = function () {
            var url, div, pos;

            updateHeight();
            throttle = false;

            if (initialPage) {
                // Cache the initial page content, if we're doing pjax
                if (supportsHistory) {
                    cache[initialPage] = $(visiblePane).html();
                }
                // Set the url for pushState
                url = initialPageRaw;
                initialPage = initialPageRaw = undefined;
            }
            else {
                // Set the url for pushState
                url = visiblePane.dataset.url;
                referrer = window.location.href; // this works because we havent yet push'd the new URL
            }

            // Collect pagedata for the now-visible content
            pageData = getPageData();

            if (pageData.title) {
                div = document.createElement('div');
                div.innerHTML = pageData.title; // resolves any html entities
                document.title = div.firstChild.nodeValue;
            }

            if (!noHistoryPush) {
                var state = {
                    id: uid.nxt(),
                    editionPos: editionPos
                };
                doHistoryPush(state, document.title, url);
            }
            noHistoryPush = false;

            // Update href of canonical link tag, using newly updated location
            canonicalLink.attr('href', window.location.href);

            // Add some stats to pageData

            // Fire the main aftershow callback
            opts.afterShow({
                initiatedBy:   initiatedBy,
                referrer:    referrer,
                visiblePane: visiblePane,
                api:         api
            });

            // Update our edition position.
            // Note: the edition is either set in the initial config, or in opts.afterShow using the passed in api:
            // e.g. if you're passing editions via a page's pageData mechanism, do api.setEdition(pageData.edition)
            pos = posInEdition(normalizeUrl(url));
            if (pos > -1) {
                inEdition = true;
                editionPos = pos;
            }
            else {
                inEdition = false;
            }
            // Initialize pjax and swipability, if supported
            // Once init'd, this fn sets up sidepanes after each page transition.
            // The sidepanes are selected from the edition,
            appSetup();
        };

        var spinner = (function () {
            var
                el = $(opts.loadingIndicator),
                obj = {};
            if(el.length) {
                obj.show = function () {
                    el.show();
                };
                obj.hide = function () {
                    el.hide();
                };
            }
            else {
                obj.show = obj.hide = noop;
            }
            return obj;
        }());

        var posInEdition = function (url) {
            return inArray(normalizeUrl(url), edition);
        };

        var urlInEdition = function (pos) {
            return pos > -1 && pos < editionLen ? edition[pos] : edition[0];
        };

        var setEdition = function (arr) {
            var
                checksum,
                pos;
            // Load edition and reset editionPos, if passed-in edition differs with existing one, and contains three or more url items
            if (arr.length && arr.length >= 3) {
                checksum = genChecksum(arr.toString());
                // Only set edition if different to existing edition, according to checksum
                if (editionChecksum !== checksum) {
                    edition = arr;
                    editionLen = arr.length;
                    editionPos = -1;
                    inEdition = false,
                    editionChecksum = checksum;
                }
            }
        };

        // Gets redefined progressively
        var gotoUrl = function (url) {
            window.location.href = url;
        };

        var getAdjacentUrl = function (dir) {
            // dir = 1 : right
            // dir = -1 : left

            if (dir === 0) {
                return urlInEdition(editionPos);
            }
            // Cases where we've got next/prev overrides in the current page's data
            else if (pageData.nextUrl && dir === 1) {
                return pageData.nextUrl;
            }
            else if (pageData.prevUrl && dir === -1) {
                return pageData.prevUrl;
            }
            // Cases where we've got an edition position already
            else if (editionPos > -1 && inEdition) {
                return urlInEdition((editionPos + dir).mod(editionLen));
            }
            else if (editionPos > -1 && !inEdition) {
                // We're displaying a non-edition page; have current-edition-page to the left, next-edition-page to right
                return urlInEdition((editionPos + (dir === 1 ? 1 : 0)).mod(editionLen));
            }
            // Cases where we've NOT yet got an edition position
            else if (dir === 1) {
                return urlInEdition(1);
            }
            else {
                return urlInEdition(0);
            }
        };

        // Gets redefined progressively
        var throttledSlideIn = function (dir) {
            if (!throttle) {
                throttle = true;
                doFirst();
                gotoUrl(getAdjacentUrl(dir));
            }
        };

        bean.on(document, 'keydown', function (e) {
            initiatedBy = 'keyboard_arrow';
            switch(e.keyCode) {
                case 37: throttledSlideIn(-1);
                    break;
                case 39: throttledSlideIn(1);
                    break;
            }
        });

        var uid = (function () {
            var i = 0;
            return {
                set: function (n) { i = n; },
                nxt: function () { return i += 1; },
                get: function () { return i; }
            };
        }());

        var validateClick = function (event) {
            var link = event.currentTarget;
            // Middle click, cmd click, and ctrl click should open links in a new tab as normal.
            if (event.which > 1 || event.metaKey || event.ctrlKey) { return; }
            // Ignore cross origin links
            if (location.protocol !== link.protocol || location.host !== link.host) { return; }
            // Ignore anchors on the same page
            if (link.hash && link.href.replace(link.hash, '') === location.href.replace(location.hash, '')) { return; }
            return true;
        };

        var gotoEditionPage = function (pos) {
            var dir;
            if (pos !== editionPos && pos < editionLen) {
                doFirst();
                dir = pos < editionPos ? -1 : 1;
                editionPos = pos;
                gotoUrl(urlInEdition(pos), dir);
            }
        };

        var doHistoryPush = (function () {
            if (supportsHistory && window.history) {
                return function (state, title, url) {
                    window.history.pushState(state, title, url);
                };
            }
            else {
                return noop;
            }
        }());

        var doFirst = function () {
            opts.beforeShow();
        };

        // This'll be the public api
        var api = {
            setEdition: setEdition,

            getEdition: function(){
                return edition;
            },

            gotoEditionPage: function(pos, type){
                initiatedBy = type ? type.toString() : 'position';
                gotoEditionPage(pos, type);
            },

            gotoUrl: function(url, type){
                initiatedBy = type ? type.toString() : 'link';
                gotoUrl(url);
            },

            gotoNext: function(type){
                initiatedBy = type ? type.toString() : 'screen_arrow';
                throttledSlideIn( 1);
            },

            gotoPrev: function(type){
                initiatedBy = type ? type.toString() : 'screen_arrow';
                throttledSlideIn(-1);
            }
        };

        var genChecksum = function (s) {
            var i;
            var chk = 0x12345678;
            for (i = 0; i < s.length; i++) {
                chk += (s.charCodeAt(i) * i);
            }
            return chk;
        };

        // Setup ajax + pushState, if browser supports it
        var appSetup = function () {

            // Make this function no-operation for the next time.
            // N.B. This is actually redefined later, if transitions are supported.
            appSetup = noop;

            // bail now if history api not supported
            if (!supportsHistory) {
                return;
            }

            // Redefine this function
            gotoUrl = function (url) {
                doFirst();
                load({
                    url: url,
                    container: visiblePane,
                    showSpinner: true,
                    callback: function () {
                        doAfterShow();
                    }
                });
            };

            // Bind back/forward button behavior
            window.onpopstate = function (event) {
                var
                    state = event.state,
                    popId,
                    dir;
                // Ignore inital popstate that some browsers fire on page load
                if (!state) { return; }
                initiatedBy = 'browser_history';
                popId = state.id ? state.id : -1;
                // Deduce the bac/fwd pop direction
                dir = popId < uid.get() ? -1 : 1;
                uid.set(popId);
                // Prevent a history stats from being pushed
                noHistoryPush = true;
                editionPos = state.editionPos;
                // Reveal the newly poped location
                gotoUrl(normalizeUrl(window.location.href), dir);
            };

            // Bind clicks
            bean.on(document, 'click', opts.linkSelector, function (e) {
                var
                    url;
                if (!validateClick(e)) { return true; }
                e.preventDefault();
                url = normalizeUrl($(this).attr('href'));
                if (url === normalizeUrl(window.location.href)) {
                    // Force a complete reload if the link is for the current page
                    window.location.reload(true);
                }
                else {
                    initiatedBy = 'link';
                    gotoUrl(url);
                }
            });

            // Enhance for swipability
            //
            // If transitions aren't supported, or the edition has less than three pages, bail
            if (!supportsTransitions || editionLen < 3) {
                return;
            }

            // Redefine this function
            gotoUrl = function (url, dir) {
                var pos = posInEdition(url);
                doFirst();
                if (normalizeUrl(window.location.pathname) === url) {
                    dir = 0; // load back into visible pane
                }
                else if (typeof dir === 'undefined') {
                    dir = pos > -1 && pos < editionPos ? -1 : 1;
                }
                preparePane({
                    url: url,
                    dir: dir,
                    slideIn: true
                });
            };

            // Redefine this function
            reloadContent = function () {
                reloadPane( 0);
                reloadPane( 1);
                reloadPane(-1);
            };

            // Redefine this function
            repaintContent = function () {
                repaintPane( 0);
                repaintPane( 1);
                repaintPane(-1);
            };

            var reloadPane = function (dir) {
                var el = panes.masterPages[(paneNow + dir).mod(3)];
                load({
                    url: el.dataset.url,
                    container: el
                });
            };

            var repaintPane = function (dir) {
                var el = panes.masterPages[(paneNow + dir).mod(3)];
                opts.afterLoad(el);
            };

            var preparePane = function (o) {
                var
                    dir = o.dir || 0, // 1 is right, -1 is left.
                    url = o.url,
                    doSlideIn = !!o.slideIn,
                    el;

                if (!url) {
                    url = getAdjacentUrl(dir);
                }
                url = normalizeUrl(url); // normalize
                el = panes.masterPages[(paneNow + dir).mod(3)];
                
                // Only load if not already loaded into this pane, or cache has been flushed
                if (el.dataset.url !== url || isEmptyObj(cache)) {
                    el.innerHTML = ''; // Apparently this is better at preventing memory leaks that jQuert's .empty()
                    load({
                        url: url,
                        container: el,
                        showSpinner: doSlideIn,
                        callback: function () {
                            // el might have become visiblePane since request was made, e.g. due to rapid swiping. If so, no need to slideInPane
                            if (el === visiblePane) {
                                doAfterShow();
                            }
                            // before slideInPane, confirm that this pane hasn't had its url changed since the request was made
                            else if (doSlideIn && el.dataset.url === url) {
                                slideInPane(dir);
                            }
                        }
                    });
                }
                else if (doSlideIn) {
                    slideInPane(dir);
                }
            };

            var slideInPane = function (dir) {
                doFirst();
                switch(dir) {
                    case 1:
                        panes.next();
                        break;
                    case -1:
                        panes.prev();
                        break;
                    default:
                        doAfterShow();
                }
            };

            var loadSidePanes = function () {
                preparePane({
                    dir: 1
                });
                preparePane({
                    dir: -1
                });
            };

            // Redefine this function
            throttledSlideIn = function (dir) {
                if (!throttle) {
                    throttle = true;
                    slideInPane(dir);
                }
            };

            // Fix pane margins, so sidepanes come in at their top
            bean.on(window, 'scroll', function () {
                hiddenPaneMargin = Math.max( 0, $(window).scrollTop() - contentAreaTop );
                if( hiddenPaneMargin < visiblePaneMargin ) {
                    // We've scrolled up over the offset; reset all margins and jump to topmost scroll
                    $(panes.masterPages[(paneNow).mod(3)]).css(  'marginTop', 0);
                    $(panes.masterPages[(paneNow+1).mod(3)]).css('marginTop', 0);
                    $(panes.masterPages[(paneNow-1).mod(3)]).css('marginTop', 0);
                    // And reset the scroll
                    $(window).scrollTop( contentAreaTop );
                    visiblePaneMargin = 0;
                    hiddenPaneMargin = 0;
                }
                else {
                    // We've scrolled down; push L/R sidepanes down to level of current pane
                    $(panes.masterPages[(paneNow+1).mod(3)]).css('marginTop', hiddenPaneMargin);
                    $(panes.masterPages[(paneNow-1).mod(3)]).css('marginTop', hiddenPaneMargin);
                }
            });

            // Swipe setup
            panes = new SwipeView(contentArea, {});

            panes.onFlip(function () {
                paneNow = (panes.pageIndex+1).mod(3);
                if (paneThen !== paneNow) {
                    // shuffle down the pane we've just left
                    $(panes.masterPages[paneThen]).css('marginTop', hiddenPaneMargin);
                    visiblePaneMargin = hiddenPaneMargin;

                    paneThen = paneNow;
                    visiblePane = panes.masterPages[paneNow];

                    if (visiblePane.dataset && visiblePane.dataset.waiting === '1') {
                        spinner.show();
                    }
                    doAfterShow();
                }
            });
            panes.onMoveOut(function () {
                doFirst();
                initiatedBy = 'swipe';
            });

            // Identify and decorate the initially visible pane
            visiblePane = panes.masterPages[1];
            visiblePane.dataset.url = normalizeUrl(window.location.href);

            // Load the sidepanes
            loadSidePanes();

            // Redefine appSetup (which is called in every doAfterShow) to reload sidepanes after each transition
            appSetup = loadSidePanes;
        
            // Set a body class. Might be useful.
            $('body').addClass('has-swipe');
        };

        // MAIN: Render the initial content
        opts.afterLoad(visiblePane);

        // Setup some context
        initialPageRaw = window.location.href;
        initialPage = normalizeUrl(initialPageRaw);

        // Load the initial edition
        setEdition(opts.edition);

        // Decide if we do a content reload or not. In all cases, make sure afterShow eventually runs, which will in turn run appSetup.
        // 1. Always reload, when in emulator mode, so that the final DOM is appropriate for the current window width
        if(opts.emulator) {
            reloadContent(doAfterShow);
        }
        // 2. Server has provided a width guess.
        else if (opts.widthGuess) {
            doAfterShow();
        }
        // 3. Reload fragment if we're above the lowest breakpoint,
        else if (getBreakpoint() > opts.breakpoints[0]) {
            reloadContent(doAfterShow);
        }
        // 4. Default
        else {
            doAfterShow();
        }

        // Flush cache on expiry
        if (opts.expiryPeriod) {
            setInterval(function(){
                cache = {};
            }, parseInt(opts.expiryPeriod, 10));
        }
    
        // Set a periodic height adjustment for the content area. Necessary to account for diverse heights of side-panes as they slide in, and dynamic page elements.
        setInterval(function(){
            updateHeight();
        }, 509); // Prime number, for good luck

        // Return an API
        return api;

    };

    return module;

});