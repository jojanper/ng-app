/**
 * @ngdoc directive
 * @name appAlert
 * @scope
 * @restrict E
 *
 * @description
 * Directive for showing alert message.
 *
 * @param {Scope|string} alertType Type of message alert. Supported types:
 *
 *   * error: Show as error message.
 *   * success: Show as success message.
 *   * warning: Show as warning message.
 *   * notice: Show as notice message.
 *
 * @param {Scope|string} msgBody Alert message.
 * @param {Scope|number} msgIndex Index for the alert message.
 * @param {Scope|number} closeSpeed Closing speed when removing alert message element, in milliseconds.
 *
 * @example
 <example>
   <file name="index.html">
     <app-alert alert-type="error" msg-body="This is alert message" msg-index="0" close-speed="200"></app-alert>
   </file>
 </example>
 */
define(['text!./templates/alert.html'], function (AlertTemplate) {
    "use strict";

    // TODO: Remove scope, add as attributes; msgIndex as optional
    var Alert = function () {

        return {
            template: AlertTemplate,
            restrict: 'E',
            replace: true,
            scope: {
                alertType: "@",
                msgBody: "@",
                msgIndex: "@",
                closeSpeed: "@"
            },
            link: function($scope, $element, attrs) {
                /*
                 * The element has been closed by user. Let app messages
                 * controller know that alert message can be removed from
                 * any local lists etc.
                 */
                $scope.$on('remove-on-click-closed', function(event, message){
                    // Emit message removal upwards through the scope hierarchy.
                    $scope.$emit("remove-app-message", $scope.msgIndex);
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'appAlert',
        cls: Alert
    };
});
