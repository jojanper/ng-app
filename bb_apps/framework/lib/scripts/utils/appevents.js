define(['underscore',
        'backbone',
        'jquery',
        '../base/baseview',
        './alert'],
function(_, Backbone, $, BaseView, Alert) {

    var UiMessageEvents = BaseView.extend({

        initialize: function(options) {
            this.options = options || {};

            /*
             * Listen UI messages.
             */
            if (this.options.appContext) {
                var vent = this.options.appContext.vent;
                if (vent) {
                    this.listenTo(vent, 'uimessage:success', this.uiSuccessMessage);
                    this.listenTo(vent, 'uimessage:notice', this.uiNoticeMessage);
                    this.listenTo(vent, 'uimessage:warning', this.uiWarningMessage);
                    this.listenTo(vent, 'uimessage:error', this.uiErrorMessage);
                }
            }
        },

        /**
         * Render UI message.
         */
        _setUiMessage: function(type, message) {
            var msgBody = '';

            if (message.msgTitle) {
                msgBody += message.msgTitle + ' ';
            }

            if (message.response) {
                if (message.response.responseText) {
                    var elementsFound = false;
                    var html = $.parseHTML(message.response.responseText);
                    $.each(html, function(i, el) {
                        if(el.nodeName == 'TITLE' || el.nodeName == 'DIV') {
                            elementsFound = true;
                            msgBody += el.innerHTML;
                        }
                    });

                    if (!elementsFound) {
                        msgBody += message.response.responseText;
                    }
                }
                else if (message.response.responseJSON) {
                    if (message.response.responseJSON.errors) {
                        _.each(message.response.responseJSON.errors, function(error) {
                            msgBody += error;
                        });
                    }
                    else {
                        msgBody += message.response.responseJSON;
                    }
                }
            }

            new Alert({
                el: "#alert-messages-wrapper",
                msgType: type,
                msgBody: msgBody
            }).render();
        },

        /**
         * UI message mappers.
         */
        uiSuccessMessage: function(data) { this._setUiMessage('success', data); },
        uiNoticeMessage: function(data) { this._setUiMessage('notice', data); },
        uiWarningMessage: function(data) { this._setUiMessage('warning', data); },
        uiErrorMessage: function(data) { this._setUiMessage('error', data); },
    });


    /**
     * Application wide events handler.
     */
    return BaseView.extend({

        initialize: function(options) {
            this.options = options || {};
            this.uiMessageEvents = new UiMessageEvents(this.options);
            this.appEvents();
        },

        /**
         * The application should override this function to provide handling of app
         * specific events on top of the library provided events.
         */
        appEvents: function() {
        },

    }, {_id: 'AppEvents'});
});
