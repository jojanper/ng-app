/**
 * Handle key press events.
 */
define([
    'common/toolbox'
], function (Toolbox) {
    "use strict";

    var AppKeyPress = Toolbox.BaseClass.extend({

        // http://unixpapa.com/js/key.html
        keyCodes: {
            space: 32,
            enter: 13,
            tab: 9,
            esc: 27,
            backspace: 8
        },

        /**
         * Constructor.
         *
         * @param {Object} $scope Scope object.
         * @param {Object} $element DOM element.
         * @param {Object} $attrs Attributes for key press.
         *   Supported attributes:
         *     - appKey (value 'focus' assigns tabindex to the element)
         *     - keyPress (key press value, e.g., esc)
         *     - keyPressAction (action to trigger when specified key pressed)
         */
        constructor: function($scope, $element, $attrs) {
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
        },

        execute: function() {
            if (this.keyCodes[this.$attrs.keyPress]) {
                var self = this;

                // Give the element a tabindex so it can receive focus
                if (this.$attrs.appKey === 'focus') {
                    this.$element.attr('tabindex', '0');
                }

                // When specified key is pressed, execute the action
                this.$element.on("keydown", function (event) {
                    if (event.which === self.keyCodes[self.$attrs.keyPress]) {
                        self.$scope.$apply(function () {
                            self.$scope.$eval(self.$attrs.keyPressAction);
                        });

                        event.preventDefault();
                    }
                });
            }
        }
    });

    return AppKeyPress;
});
