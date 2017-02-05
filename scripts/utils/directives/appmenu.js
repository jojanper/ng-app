define([
    'text!./templates/appmenu.html',
    'apps/menuConfig',
    'utils/controllers/basecontroller'
], function (AppMenuTemplate, DefaultMenuItems, BaseCtrl) {
    "use strict";

    var AppMenuController = BaseCtrl.extend({});

    /**
     * @ngdoc directive
     * @name appMainMenu
     * @restrict E
     *
     * @description
     * Application main menu.
     *
     * @param {Array=} menuItems Menu items as assignable angular expression.
     * @param {string} menuItems.display Display name for the item.
     * @param {string} menuItems.link URL link for the item.
     *
     * @example
       <example>
         <file name="index.html">
           <app-main-menu></app-main-menu>
         </file>
       </example>
     */
    var AppMainMenu = function () {
        return {
            restrict: 'E',
            template: AppMenuTemplate,
            controller: ['$scope', '$element', '$attrs', AppMenuController],
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
