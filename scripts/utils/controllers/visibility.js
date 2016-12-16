/**
 * Controller for element visibility changes etc.
 */
define([
    './basecontroller',
    'utils/common/signals'
], function (BaseCtrl, Signals) {
    "use strict";

    var VisibilityCtrl = BaseCtrl.extend({

        initialize: function() {
            var self = this;

            // Visibility container
            this.$scope.elements = [];

            /**
             * Add element to visibility container.
             */
            this.$scope.$on(Signals.visibility.name, function(event, data) {
                // Hide the element
                data.$element.addClass('hidden');

                // Include element details to reverse the hide operation
                self.$scope.elements.push({
                    title: data.$attrs.title || data.$attrs.hideTitle || 'Element has no name',
                    index: self.$scope.elements.length,
                    $element: data.$element
                });
            });

            /**
             * Restore element visibility.
             *
             * @param {Object} element Element details.
             * @param {Object} element.title Title shown by UI to differentiate elements.
             * @param {Object} element.index Index of details within local storage.
             * @param {Object} element.$element HTML element object.
             */
            this.$scope.restore = function(element) {

                // Show the element
                element.$element.removeClass('hidden');

                // Remove details from local storage (which updates then the UI).
                for (var index = 0; index < self.$scope.elements.length; index++) {
                    if (self.$scope.elements[index].index === element.index) {
                        self.$scope.elements.splice(index, 1);
                        break;
                    }
                }
            };

            /**
             * Flush elements stored in the container.
             */
            this.$scope.$on(Signals.visibilityFlush.name, function() {
                for (var i = 0; i < self.$scope.elements.length; i++) {
                    self.$scope.elements[i].$element.removeClass('hidden');
                }
                self.$scope.elements.splice(0, self.$scope.elements.length);
            });
        }
    });

    return {
        feature: 'controller',
        name: 'VisibilityCtrl',
        cls: ['$scope', '$element', '$attrs', VisibilityCtrl]
    };
});
