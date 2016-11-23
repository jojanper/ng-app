define(['underscore',
        'backbone',
        './toolbox'],
function (_, Backbone, Toolbox) {

    /**
     * Application context, provides access to app-wide services
     */
    return Toolbox.BaseClass.extend({
        vent: null,

        constructor: function(options) {
            this.options = options;
            this.vent = _.extend({}, Backbone.Events);
        }

    }, {_id: 'AppContext'});
});
