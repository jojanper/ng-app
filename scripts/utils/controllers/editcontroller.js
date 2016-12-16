/**
 * Base class for model edit controllers.
 */
define([
    'angular',
    'utils/controllers/basecontroller'
], function(angular, BaseCtrl) {

    var EditCtrl = BaseCtrl.extend({

        constructor: function($scope, $element, $attrs, $stateParams) {

            this.$stateParams = $stateParams;

            // Call parent with all arguments
            BaseCtrl.apply(this, Array.prototype.slice.call(arguments, 0));

            // Start loading spinner
            $scope.setToLoadingState();

            // Save model ID
            $scope.id = $stateParams.id;

            // Remaining initialization, if any
            if (this.editInitialize) {
                this.editInitialize($scope);
            }
        }
    });

    return EditCtrl;
});
