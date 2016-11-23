define(['jquery',
        'underscore',
        'framework',
        'backbone',
        'backbone.localStorage'],
function($, _, AppLib, Backbone) {

    return Backbone.Model.extend({
        initialize: function(options) {
            this.selected = false;
            this.visible = true;
        },

        _stripTrailingSlash: function(str) {
            if(str.substr(-1) == '/') {
                return str.substr(0, str.length - 1);
            }
            return str;
        },

        /*
         * Override the default model sync to fix the URL
         * and make sure that CSRF cookie is included in the request.
         */
        sync: function(method, model, options) {
            options = options || {};
            options.url = this._stripTrailingSlash(model.url());

            AppLib.DraalLib.Ajax.csrfTokenSetup();
            Backbone.sync(method, model, options);
        },

        /**
         * Select this model as selected model.
         */
        select: function(status) {
            if (status == true || status == false) {
                this.selected = status;
            }
        },

        /**
         * Set visibility status (show or hide).
         */
        set_visibility: function(status) {
            if (status === true || status === false) {
                this.visible = status;
            }
        }

    });
});
