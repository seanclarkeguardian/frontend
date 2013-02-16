define(["EventEmitter", "bonzo", "qwery"], function (EventEmitter, bonzo, qwery) {
    return {
        mediator: new EventEmitter(),
        $g: function (selector, context) {
            if (context) {
                return bonzo(qwery(selector, context));
            }
            return bonzo(qwery(selector));
        },
        deferToLoadEvent : function(ref) {
            if (document.readyState === 'complete') {
                ref();
            } else {
                window.addEventListener('load', function() {
                    ref();
                });
            }
        },
        extend : function(destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }
            return destination;
        },
        inArray : function(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] === needle) {
                    return i;
                }
            }
            return -1;
        },
        pushIfNew : function(item, array) {
            if (this.inArray(item, array) === -1) {
                array.push(item);
            }
        },
        urlPath : function(url) {
            var a = document.createElement('a');
            a.href = url;
            a = a.pathname + a.search;
            a = a.indexOf('/') === 0 ? a : '/' + a; // because IE doesn't return a leading '/'
            return a;
        }
    };
});
