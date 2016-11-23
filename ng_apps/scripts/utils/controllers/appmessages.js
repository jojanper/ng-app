/**
 * Controller for application messages.
 */
define([], function () {
    "use strict";

    var AppMessagesCtrl = function($scope, appMessagesService) {
        var self = this;

        self.alerts = appMessagesService.getMessages();

        /*
         * App messages has been closed and message can be removed.
         */
        $scope.$on('remove-app-message', function(event, alertIndex){
            self.closeAlert(alertIndex);
        });

        /**
         * Closes the alert and removes it from the list of alerts.
         * @param alertIndex Alert message index
         */
        self.closeAlert = function(alertIndex) {
            if (alertIndex >= 0) {
                appMessagesService.removeMessage(alertIndex);
            }
        };
    };

    return {
        feature: 'controller',
        name: 'AppMessagesCtrl',
        cls: ['$scope', 'appMessagesService', AppMessagesCtrl]
    };
});
