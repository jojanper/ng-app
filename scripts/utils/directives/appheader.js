define([
    'text!./templates/appheader.html',
    'utils/controllers/basecontroller'
], function (AppHeaderTemplate, BaseCtrl) {
    "use strict";

    var AppHeaderController = BaseCtrl.extend({
        initialize: function($scope) {
            var $state = this.arguments[0];

            $scope.headerItems = [
                {
                    link: $state.href('profile'),
                    text: 'My profile'
                },
                {
                    link: $state.href('auth.logout'),
                    text: 'Sign out'
                }
            ];

            $scope.canShowAuth = function() {
                return (!$state.includes('auth.login')) ? !$scope.isAuthenticated() : false;
            };
        }
    });

    /**
     * @ngdoc directive
     * @name appHeader
     * @restrict E
     *
     * @description
     * Application header component.
     *
     * @example
       <example>
         <file name="index.html">
           <app-header></app-header>
         </file>
       </example>
     */
    var AppHeader = function () {
        return {
            scope: {},
            restrict: 'E',
            template: AppHeaderTemplate,
            controller: ['$scope', '$element', '$attrs', '$state', AppHeaderController]
        };
    };

    return {
        feature: 'directive',
        name: 'appHeader',
        cls: AppHeader
    };
});
