define(["jquery",
        "underscore",
        "backbone",
        "backbone.localStorage",
        "backbone.subroute"],
function($, _, Backbone) {

    return Backbone.Router.extend({

        initialize: function(options) {
            this.routerObjs = {};
            this.viewClass = null;
            this.options = options;
            this.routerTags = options.routerTags;

            this._baseInit(options);
        },

        _baseInit: function(options) {
        },

        /*
         * Activate specified router.
         */
        _startRouter: function(routerModuleKey) {
            var objKey = this.routerTags[routerModuleKey]['key'];
            if (!this.routerObjs.hasOwnProperty(objKey)) {
                var objClass = this.routerTags[routerModuleKey]['object'];
                var prefix = this.routerTags[routerModuleKey]['prefix'];
                this.routerObjs[objKey] = new objClass(prefix, $.extend(this.options, {
                    'router': this
                }));
            }
        },

        defaultRoute: function(actions) {
            console.log('No route:', actions);
        },

        /*
         * Update UI tabs based on selected route.
         */
        updateTabs: function(route) {
            $('.tabs li').each(function () {
                $(this).removeClass("tabActiveHeader");
            });

            $('.tabs li').each(function () {
                var href = $(this).find('a').attr("href");
                if (href.indexOf(route) >= 0) {
                    $(this).addClass("tabActiveHeader");
                    return false;
                }
            });
        },

        /*
         * Get route mappings for route to URL conversions.
         */
        reverse: function() {
            var routes = {};
            for (var key in this.routerTags) {
                if (key) {
                    try {
                        var obj = this.routerTags[key]['object'];
                        var prefix = this.routerTags[key]['prefix'];
                        routes = $.extend(routes, obj.prototype.reverse(prefix));
                    } catch (err) {
	                if (err.name === 'TypeError') {
                            ;
                        }
                    }
                }
            }

            return routes;
        },

        /*
         * Navigate to specified view.
         */
        navigateTo: function(prefix, viewClass, options) {
            this.updateTabs(prefix);

            if (this.viewClass) {
                this.viewClass.closeView(prefix);
            }

            this.viewClass = viewClass.createView(options);
        }
    });
});
