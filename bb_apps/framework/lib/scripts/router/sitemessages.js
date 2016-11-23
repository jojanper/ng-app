define(['underscore',
        'backbone',
        'jquery',
        '../base/basesubrouter',
        '../utils/sitemessages'],
function(_, Backbone, $, BaseSubRouter, SiteMessages) {

    /**
     * Subrouter for site messages view.
     */
    return BaseSubRouter.extend({

        routes: {
            "": "siteMessages",
            '*actions': 'defaultRoute'
        },

        subRouterInitialize: function() {
            this.appHandler = null;
        },

        siteMessages: function() {
            var self = this;
            this.options.router.navigateTo(this.prefix, this, {
                'callback': function() {
                    self.appHandler = new SiteMessages();
                }
            });
        },

    }, {_id: 'SiteMessages'});
});
