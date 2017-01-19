define([
    'text!./templates/breadcrumb.html',
    'utils/common/signals',
    'utils/controllers/basecontroller'
], function (BreadcrumbTemplate, Signals, BaseCtrl) {
    "use strict";

    var defaultPageTitle = 'Select app';

    /**
     * @ngdoc directive
     * @name breadcrumb
     * @restrict E
     *
     * @description
     * Breadcrumb navigation component. Works with angular ui-router component, specifically
     * listens $stateChangeSuccess events and constructs the breadcrumbs from the $state variable.
     *
     * @example
       <example>
         <file name="index.html">
           <breadcrumb></breadcrumb>
         </file>
       </example>
     */
    var Breadcrumb = function ($state, utilsfactory) {
        return {
            restrict: 'E',
            template: BreadcrumbTemplate,
            controller: ['$scope', '$element', '$attrs', 'appUrlResolver', BaseCtrl.extend({

                initialize: function($scope) {
                    // Application models dropdown menu title
                    $scope.subAppsMenuTitle = defaultPageTitle;

                    // Available application models for selection in current page
                    $scope.appModels = [];


                    // Breadcrumbs
                    $scope.breadcrumbs = [];

                    /*
                     * Page was successfully changed. Start from current page, traverse towards root page
                     * and on every page state save the name and link. The breadcrumb is then the stored
                     * data in reverse order (start from root page towards current page).
                     */
                    $scope.$on("$stateChangeSuccess", function () {
                        var state = $state.$current;

                        // Reset current breadcrumb
                        $scope.breadcrumbs.splice(0, $scope.breadcrumbs.length);

                        // Go from current page towards root page
                        while (state) {
                            if (state.name && state.breadcrumb !== false) {
                                var name = state.display || state.breadcrumb || state.locals.globals.$stateParams.id;
                                var link = state.name + '(' + JSON.stringify(state.locals.globals.$stateParams) + ')';

                                $scope.breadcrumbs.push({
                                    name: name,
                                    link: link,
                                    state: state,
                                    parent: state.parent
                                });
                            }

                            state = state.parent;
                        }

                        // Page change -> reset visibility component
                        $scope.$root.$emit(Signals.visibilityFlush.name, new Signals.visibilityFlush.cls($scope));

                        // Application models for dropdown list
                        $scope.subAppsMenuTitle = defaultPageTitle;
                        if ($scope.breadcrumbs.length) {

                            // Reset the available application models
                            $scope.appModels.splice(0, $scope.appModels.length);

                            // Determine which application models are available for current page
                            state = $scope.breadcrumbs[0].state;
                            utilsfactory.getPageModels(state, function(appModels, selectedModelDisplayName) {
                                for (var i = 0; i < appModels.length; i++) {
                                    $scope.appModels.push(appModels[i]);
                                }

                                /*
                                 * Use the display name of the model in the dropdown menu to indicate which
                                 * model has been selected from list.
                                 */
                                $scope.subAppsMenuTitle = selectedModelDisplayName;
                            });
                        }
                    });
                }
            })]
        };
    };

    return {
        feature: 'directive',
        name: 'breadcrumb',
        cls: ['$state', 'utilsfactory', Breadcrumb]
    };
});
