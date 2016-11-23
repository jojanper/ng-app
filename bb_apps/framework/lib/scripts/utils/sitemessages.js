define(['underscore',
        'backbone',
        'jquery',
        './sitenews',
        '../base/baseview'],
function(_, Backbone, $, SiteNews, BaseView) {

    /**
     * Site messages view
     */
    return BaseView.extend({

        initialize: function(options) {
            this.subViews = {};
            this.options = options || {};
            this.subViews['sitenews'] = new SiteNews();
        },

    }, {_id: 'SiteMessages'});
});
