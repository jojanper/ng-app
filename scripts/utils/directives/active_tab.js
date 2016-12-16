/**
 * @description
 * ActiveTab directive for activating correct tab based on current location.
 *
 * The activeTab attribute should contain a path search string to match on, i.e.,
 * <li><a href="#/nested/section1/partial" active-tab="/section1">First Partial</a></li>
 *
 * @example
   <ul>
     <li><a href="#/about" active-tab="/about">About</a></li>
     <li><a ui-sref="home" active-tab="/home">Home</a></li>
   </ul>
 */
define([], function () {
    "use strict";

    var activeTabCls = 'tabActiveHeader';

    var processTab = function ($location, element, attrs) {
        if ($location.path().indexOf(attrs.activeTab) >= 0) {
            element.parent().addClass(activeTabCls); //parent to get the <li>
        } else {
            element.parent().removeClass(activeTabCls);
        }
    };

    var ActiveTab = function ($location) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                // Broadcasted after a route dependencies are resolved. ngView listens for the directive
                // to instantiate the controller and render the view.
                scope.$on("$routeChangeSuccess", function (event, current, previous) {
                    processTab($location, element, attrs);
                });

                // $stateChangeSuccess - fired once the state transition is complete.
                // see https://github.com/angular-ui/ui-router/wiki
                scope.$on("$stateChangeSuccess", function (event, current, previous) {
                    processTab($location, element, attrs);
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'activeTab',
        cls: ['$location', ActiveTab]
    };
});
