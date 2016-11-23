define([
], function () {
    "use strict";

    var defaultPageTitle = 'Select app';

    /**
     * @ngdoc directive
     * @name delayedSearch
     * @restrict E
     *
     * @description
     * Search input with delayed execution.
     *
     * @param {string=} delayedMethod Function to be called when execution is triggered as assignable angular expression.
     * @param {string=} show Visibility status of component as assignable angular expression.
     * @param {string=} placeholder Expected input format as textual cue for the user.
     * @param {string=} delay Debounce model update value in milliseconds, default 500.
     *
     * @example
       <example>
         <file name="index.html">
           <delayed-search placeholder="Type search keyword" delay="600"></delayed-search>
         </file>
       </example>
     */
    var DelayedSearch = function () {
        return {
            restrict: 'E',
            scope: {
                delayedMethod: '&',
                show: '='
            },
            template: '<input ng-show="show" ng-model="search" ng-attr-placeholder="{{ placeholder }}" ' +
                'ng-change="modelChanged()" ng-model-options="modelOptions">',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var delay = $attrs.delay ? parseInt($attrs.delay) : 500;
                $scope.modelOptions = {debounce: delay};

                $scope.modelChanged = function () {
                    if ($scope.delayedMethod) {
                        $scope.delayedMethod({search: $scope.search});
                    }
                };
            }],
            link: function ($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.placeholder = $attrs.placeholder || 'Type to search';
                    if (!$scope.hasOwnProperty('show') || $scope.show === undefined) {
                        $scope.show = true;
                    }
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'delayedSearch',
        cls: DelayedSearch
    };
});
