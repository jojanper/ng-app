/**
 * @description
 * CheckboxMenuDropdown directive for showing checkbox based dropdown menu.
 *
 * @example
   <checkbox-menu-dropdown title="Menu" on-change="onChange" menuItems="checkboxItems"></checkbox-menu-dropdown>
 *
 * # Scope:
 *
 *   * `'checkboxItems'`: Array of checkbox items
 *   * `'onChange'`: Callback function for selection changes (checkbox status is changed)
 *
 * # Attributes:
 *
 *   * `'title'`: Title for the dropdown.
 *   * `'dropdownElement'`: Dropdown element.
 */
define([], function () {
    "use strict";

    var CheckboxMenuDropdown = function () {
        return {
            scope: {
                checkboxItems: "=",
                onChange: '='
            },
            restrict: 'E',
            template: '<menu-dropdown title="{{ title }}" dropdown-element="{{ dropdownElement }}" ' +
                'type="checkbox" menu-items="menuItems"></menu-dropdown>',

            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                $scope.title = $attrs.title || 'Select';
                $scope.dropdownElement = $attrs.dropdownElement || 'button';

                $scope.menuItems = [];
                if (Array.isArray($scope.checkboxItems) && $scope.onChange) {

                    this.addItem = function(checkboxItem, index) {
                        return {
                            text: checkboxItem,
                            callback: function(callArgs, status) {
                                $scope.onChange(callArgs, status);
                            },
                            callbackArgs: {
                                index: index
                            }
                        };
                    };

                    // Build the menu structure, include callback arguments that include the checkbox index
                    for (var i = 0; i < $scope.checkboxItems.length; i++) {
                        $scope.menuItems.push(this.addItem($scope.checkboxItems[i], i));
                    }
                }
            }]
        };
    };

    return {
        feature: 'directive',
        name: 'checkboxMenuDropdown',
        cls: CheckboxMenuDropdown
    };
});
