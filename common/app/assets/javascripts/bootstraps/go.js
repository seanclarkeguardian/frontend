/*global guardian:true */
require(['bootstraps/app'], function(bootstrap) {
    if(guardian.isModernBrowser) {
        bootstrap.go(guardian.config);
    }
});
