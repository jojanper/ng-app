define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function(options) {
            this.options = options || {};
        },

        assign: function(view, selector) {
            view.setElement(this.$(selector)).render();
        },

        /*
         * Close the view.
         */
        closeView: function() {
            this.close();
        },

        clear: function() {
            this.closeView();
        },

        viewSpecificClose: function() {
        },

        clearSubviews: function(excludedViews) {
            var self = this;

            _.each(this.subViews, function(subview, key) {
                if(_.isObject(subview) && _.isFunction(subview.close)) {
                    var clearUi = true;
                    if (excludedViews) {
                        if (excludedViews.hasOwnProperty(key)) {
                            clearUi = false;
                        }
                    }

                    subview.close(clearUi);
                    delete self.subViews[key];
                }
            });
        },

        close: function(clearUi) {
            this.clearSubviews();
            if (clearUi === true || clearUi === undefined) {
                this.$el.empty();
            }
            this.viewSpecificClose();

            this.unbind();
            this.undelegateEvents();
            $(this.el).removeData().unbind();

            /*-- Remove view from DOM --*
            this.remove();
            Backbone.View.prototype.remove.call(this);*/
        },

        render: function() {
            if (this.template) {
                this.$el.html(this.template);
            }

            return this;
        }

    }, {_id: 'BaseView'});
});
