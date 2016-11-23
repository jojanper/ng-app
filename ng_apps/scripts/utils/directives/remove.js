/**
 * @description
 * RemoveOnClick directive for removing HTML of the element.
 *
 * @example
   <remove-on-click>Remove me</remove-on-click>
 *
 * # Attributes:
 *
 *   * `'closeId'`: Apply removal to this element ID that is closest to the clicked element
 *   * `'closeSpeed'`: Close speed in milliseconds
 *   * `'closeDirection'`: Direction where closing should occur, e.g., left, right
 *   * `'closeEffect'`: Type of effect for closing, e.g., fade, slide, etc
 */
define([], function () {
    "use strict";

    var RemoveOnClick = function() {
        return {
            restrict : 'E',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var obj = element;
                    if (scope.closeId) {
                        obj = element.closest(scope.closeId);
                    }

                    // Set the effect type
                    var effect = scope.closeEffect || 'slide';

                    // Set the options for the effect type chosen
                    var options = {direction: scope.closeDirection || 'left'};

                    // Set the duration (default: 200 milliseconds)
                    var duration = parseInt(scope.closeSpeed || 200);

                    obj.toggle(effect, options, duration, function() {
                        obj.html('');

                        // Emit close message upwards through the scope hierarchy.
                        scope.$emit("remove-on-click-closed", 'closed');
                    });
                });
            },
            scope: {
                closeId: "@",
                closeDirection: "@",
                closeSpeed: "@",
                closeEffect: "@"
            }
        };
    };

    return {
        feature: 'directive',
        name: 'removeOnClick',
        cls: RemoveOnClick
    };
});
