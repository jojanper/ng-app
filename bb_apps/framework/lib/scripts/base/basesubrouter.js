define(["jquery",
        "underscore",
        "backbone",
        "backbone.subroute"],
function($, _, Backbone) {

    return Backbone.SubRoute.extend({

        reverse: function(prefix) {
            var routes = {};
            for (var key in this.routes) {
                routes[prefix + key] = this.routes[key];
            }

            return _.invert(routes);
        },

        subRouterInitialize: function() {
            this.appHandler = null;
        },

        constructor: function(prefix, options) {
            this.options = options;
            this.subRouterInitialize();
            Backbone.SubRoute.prototype.constructor.call(this, prefix, options);
        },

        closeView: function(prefix) {
            if (this.prefix !== prefix) {
                this.appHandler.closeView();
            }
        },

        createView: function(options) {
            options.callback();
            return this;
        },

        defaultRoute: function(actions) {
            console.log('No route:', actions);
        }

    }, {_id: 'BaseSubRouter'});
});
