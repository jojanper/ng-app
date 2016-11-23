/**
 * BlackList validation directive for reporting invalid item names.
 *
 * Usages:
 *
 * Supported attributes:
 *
 */
define([], function () {
    "use strict";

    var BlackList = function () {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                var blacklist = attr.blacklist.split(',');

                // For DOM -> model validation
                ngModel.$parsers.unshift(function(value) {
                    var valid = blacklist.indexOf(value) === -1;
                    ngModel.$setValidity('blacklist', valid);
                    return valid ? value : undefined;
                });

                // For model -> DOM validation
                ngModel.$formatters.unshift(function(value) {
                    ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
                    return value;
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'blacklist',
        cls: BlackList
    };
});
