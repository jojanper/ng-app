/**
 * @description
 * AppMenu directive for drawing application UI main menu.
 *
 * @example
   <app-main-menu></app-main-menu>
 *
 * # Scope:
 *
 * # Attributes:
 *
 *   * `'menuItems'`: Menu items with following properties:
 *      - 'link': Link name
 *      - 'display': Display name for link
 */
define([
    'text!./templates/appmenu.html',
    'apps/menuConfig'
], function (AppMenuTemplate, DefaultMenuItems) {
    "use strict";

    var AppMainMenu = function () {
        return {
            restrict: 'E',
            template: AppMenuTemplate,
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            }],
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.menuItems = ($attrs.menuItems) ? $scope.$eval($attrs.menuItems) : DefaultMenuItems;
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'appMainMenu',
        cls: AppMainMenu
    };
});
