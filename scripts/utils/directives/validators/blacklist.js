define([], function () {
    "use strict";

    /**
     * BlackList validation directive for reporting invalid item names.
     */
    var BlackList = function () {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                var blacklist = attr.blacklist.split(',');

                ngModel.$validators.blacklist = function (modelValue, viewValue) {
                    // Value must not be blacklisted
                    return (blacklist.indexOf(viewValue) === -1);
                };
            }
        };
    };

    return {
        feature: 'directive',
        name: 'blacklist',
        cls: BlackList
    };
});
