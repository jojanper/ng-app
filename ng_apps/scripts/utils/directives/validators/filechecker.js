/**
 * Validate file input.
 *
 * Usages:
 *
 * Supported attributes:
 *
 */
define([], function () {
    "use strict";

    var FileInputChecker = function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, $elem, $attr, ngModel) {

                // For model -> DOM validation
                ngModel.$formatters.unshift(function(value) {
                    var valid = (value === null || (value && value.length < 1)) ? false : true;
                    ngModel.$setValidity('required', valid);
                    return valid ? value : null;
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'fileInputChecker',
        cls: FileInputChecker
    };
});
