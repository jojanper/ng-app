define([
    './basecontroller'
], function (BaseCtrl) {
    "use strict";

    var ModelViewerCtrl = BaseCtrl.extend({

        initialize: function($scope, $element, $attrs) {
            var self = this;

            $scope.model = null;
            $scope.ready = false;

            // Submit data to server to save the changes
            $scope.submit = function(data, url, success, error) {
                $scope.sendDataLoadedSignal();
                self.rest.submitData(data, url, $scope, $scope.model, true, success, error);
            };

            // Retrive model data for viewing
            $scope.getModelData = function() {
                self.rest.getModelData($attrs.model, $attrs.modelId, function(modelObj) {
                    $scope.model = modelObj;
                    $scope.ready = true;

                    // Send signal to loading spinner to indicate that data is ready
                    $scope.sendDataLoadedSignal();
                });
            };
        }
    });

    return {
        feature: 'controller',
        name: 'ModelViewerCtrl',
        cls: ['$scope', '$element', '$attrs', 'rest', ModelViewerCtrl]
    };
});
