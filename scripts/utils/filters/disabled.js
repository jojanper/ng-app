define([
    'angular'
], function (angular) {
    "use strict";

    var DisabledFilter = function() {
        return function(items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    if (item.disabled !== true) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    };

    return {
        feature: 'filter',
        name: 'hideDisabled',
        cls: DisabledFilter
    };
});
