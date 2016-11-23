define(['jquery',
        'jquery.ui',
        'readmore',
        'underscore',
        '../base/baseview',
        './readmore',
        'text!./templates/alert.html'],
function($, jQueryUI, jQueryReadMore, _, BaseView, ReadMore, alertTemplate) {

    /**
     * Alert class to display UI messages.
     */
    return BaseView.extend({

        /*
         * Supported messaging types.
         */
        msgTypes: {
            error: 'error',
            success: 'success',
            warning: 'warning',
            notice: 'notice'
        },

        initialize: function(options) {
            _.bindAll(this, "render", "_alertClose");
            this.options = options || {};

            this.msgType = this.options.msgType || this.msgTypes.error;
            this.msgBody = this.options.msgBody || '';

            // Unique ID for the alert
            this.viewId = _.uniqueId('alert_');

            this.readMoreObj = new ReadMore();
        },

        events: function() {
            /*
             * Register via the unique ID to avoid firing multiple events
             * when multiple alert instances are shown.
             */
            var ev = {};
            ev['click #' + this.viewId] = '_alertClose';

            return ev;
        },

        /**
         * Close alert message view.
         */
        _alertClose: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var obj = $(e.currentTarget).closest('#alert-messages-internal-wrapper');

            // Set the effect type
            var effect = 'slide';

            // Set the options for the effect type chosen
            var options = {direction: 'left'};

            // Set the duration (default: 400 milliseconds)
            var duration = 500;

            var self = this;
            obj.toggle(effect, options, duration, function() {
                self.unbind();
                self.undelegateEvents();
                obj.remove();
            });
        },

        render: function() {
            var self = this;
            var compiled_template = _.template(alertTemplate);
            var html = compiled_template({
                msgType: this.msgType,
                msgBody: this.msgBody,
                viewId: this.viewId
            });
            this.$el.append(html).show();
            this.readMoreObj.renderShowMore(function() {
                return $('#' + self.viewId).parent().parent().find('.alert-message-body');
            });

            return this;
        }

    }, {_id: 'Alert'});
});
