/**
 * Base controller.
 */
define([
    'angular',
    'underscore',
    'common/toolbox',
    'utils/common/signals'
], function(angular, _, Toolbox, Signals) {

    // Spinner search pattern
    var spinnerSearch = 'spinner .spinner-loader:first';

    // UI view search pattern
    var uiViewSearch = '.spinner-view:first';

    var hiddenClass = 'hidden';

    var BaseCtrl = Toolbox.BaseClass.extend({

        baseInitialize: true,

        constructor: function($scope, $element, $attrs) {
            this.options = {};

            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;

            // The remaining function arguments are stored here
            this.arguments = Array.prototype.slice.call(arguments, 3);

            // Assign arguments to context if '$$name' string attribute given
            for (var i = 0; i < this.arguments.length; i++) {
                if (this.arguments[i].$$name && _.isString(this.arguments[i].$$name)) {
                    this[this.arguments[i].$$name] = this.arguments[i];
                }
            }

            // Base initialization
            if (this.baseInitialize) {
                this._baseInitialize();
            }

            // Derived class initialization, if any
            if (this.initialize) {
                this.initialize($scope, $element, $attrs);
            }
        },

        /**
         * Initialize base methods that are common to all derived controllers.
         */
        _baseInitialize: function() {
            var self = this;

            /*
             * Element should be minimized and sent to visibility handler from
             * which it can be restored back to visible state.
             */
            this.$scope.hideElement = function() {
                // Send hide signal to visibility controller
                self.$scope.$emit(Signals.visibility.name, self);
            };

            // Start loading spinner and hide UI view component
            this.$scope.setToLoadingState = function() {
                self.$element.find(uiViewSearch).addClass(hiddenClass);
                self.$element.find(spinnerSearch).removeClass(hiddenClass);
            };

            // Stop (and hide) loading spinner and show UI view component
            this.$scope.setToNormalState = function() {
                if (self.$element) {
                    self.$element.find(uiViewSearch).removeClass(hiddenClass);
                    self.$element.find(spinnerSearch).addClass(hiddenClass);
                }
            };

            // Method to indicate that data for UI view is ready and can be shown to user
            this.$scope.sendDataLoadedSignal = function() {
                self.$scope.$emit(Signals.loader.name, self);
            };

            // Listen data ready events from underlying components and initiate UI view visibility to user
            this.$scope.$on(Signals.loader.name, function(event, data) {
                self.$scope.setToNormalState();
            });
        }
    });

    return BaseCtrl;
});
