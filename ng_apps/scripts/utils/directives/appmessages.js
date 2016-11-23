/**
 * AppMessages AngularJS Directive for showing alert messages.
 *
 * Usages:
 *
 * <app-messages></app-messages>
 *
 * Configuration:
 *
 * angular.module('myApp').directive('appMessages', AppMessages);
 */
define(['text!./templates/appmessage.html'], function (AppMessagesTemplate) {
    "use strict";

    var AppMessages = function () {

        return {
            template: AppMessagesTemplate,
            restrict: 'EA',
            controllerAs: 'appMessagesCtrl',
            controller: 'AppMessagesCtrl',
            link: function($scope, $element, $attrs) {
                $scope.closeSpeed = $attrs.closeSpeed || 200;
            },
            scope: {
            }
        };
    };

    return {
        feature: 'directive',
        name: 'appMessages',
        cls: AppMessages
    };
});
