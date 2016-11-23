/**
 * @description
 * Checkbox directive for checkbox status changes.
 *
 * @example
   <input type="checkbox" checkbox-change="onChange(checked)">
 */
define([], function () {
    "use strict";

    var CheckboxChange = function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                if ($attrs.checkboxChange) {

                    // On click, determine status and call callback function
                    $scope.checked = false;
                    $element.bind('click', function () {
                        $scope.checked = $element[0].checked;
                        $scope.$eval($attrs.checkboxChange);
                    });
                }
            }
        };
    };

    return {
        feature: 'directive',
        name: 'checkboxChange',
        cls: CheckboxChange
    };
});
