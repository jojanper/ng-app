define([
    'text!./templates/modelviewer.html'
], function (ViewerTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name modelViewer
     * @restrict E
     *
     * @description
     * View model details and related data.
     *
     * @param {string} model Name of model.
     * @param {string} modelId Model ID.
     *
     * @example
       <example>
         <file name="index.html">
           <model-viewer model="mediafolder" model-id="3"></model-viewer>
         </file>
       </example>
     */
    var ModelViewer = function (rest) {
        return {
            scope: {},
            restrict: 'E',
            template: ViewerTemplate,
            controller: 'ModelViewerCtrl',
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.getModelData();
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'modelViewer',
        cls: ['rest', ModelViewer]
    };
});
