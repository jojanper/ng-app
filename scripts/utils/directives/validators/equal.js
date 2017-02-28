define([], function () {
    "use strict";

    /**
     * Directive to verify that 2 model inputs are the same.
     */
    var Equality = function () {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ngModel) {
                var ref = attr.equal;

                ngModel.$validators.equal = function (modelValue, viewValue) {
                    // Model value must match the reference value
                    return (scope.model.getValue(ref) === viewValue);
                };
            }
        };
    };

    return {
        feature: 'directive',
        name: 'equal',
        cls: Equality
    };
});
