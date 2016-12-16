/**
 * @description
 * Application messages.
 */
define([], function () {
    "use strict";

    var AppMessagesService = function() {
        var self = this, messages = [];

        self.addMessage = function(message) {
            messages.push({
                type: message.type,
                msgBody: message.msgBody
            });
        };

        self.getMessages = function() {
            return messages;
        };

        self.removeMessage = function(messageIndex) {
            messages.splice(messageIndex, 1);
        };
    };

    return {
        feature: 'service',
        name: 'appMessagesService',
        cls: AppMessagesService
    };
});
