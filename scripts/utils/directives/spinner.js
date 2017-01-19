define([
    'text!./templates/spinner.html'
], function (SpinnerTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name spinner
     * @restrict E
     *
     * @description
     * Preloader component to indicate loading of view data.
     *
     * @param {string=} visible If present, preloader component is made visible, otherwise it is hidden by default
     *                          until explicitly made visible from the base controller.
     * @param {string=} [type=default] Loader type. Supported types:
     *
     *   * default: CSS loading indicator.
     *   * git-loader: GIF loading indicator.
     *
     * @example
       <example>
         <file name="index.html">
           <spinner type="gif-loader"></spinner>
         </file>
       </example>
     */
    var Spinner = function (rest) {
        return {
            scope: {},
            restrict: 'E',
            transclude: true,
            template: SpinnerTemplate,
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.type = $attrs.type || 'default';
                    if ($attrs.hasOwnProperty('visible')) {
                        $element.find('.spinner-loader').removeClass('hidden');
                    }
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'spinner',
        cls: Spinner
    };
});
