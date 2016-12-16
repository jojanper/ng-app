define([
    'text!utils/directives/templates/dialog.html',
    'utils/common/signals'
], function (DialogTemplate, Signals) {
    "use strict";

    /**
     * @ngdoc directive
     * @name appDialog
     * @restrict E
     *
     * @description
     * Dialog component.
     *
     * @param {string=} [title=""] Dialog title.
     * @param {string=} [okLabel=""] Button label for approval.
     * @param {string=} [closeLabel=""] Button label for cancellation.
     * @param {string=} width Dialog width.
     * @param {string=} height Dialog height.
     *
     * @example
       <example>
         <file name="index.html">
           <app-dialog launch-title="Launch dialog" width="200px" height="100px">Hello</app-dialog>
         </file>
       </example>
     */
    var AppDialog = function() {
        return {
            restrict: 'E',
            scope: true,
            transclude: true, // we want to insert custom content inside the directive
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                $scope.show = false;
                $scope.toggleModal = function() {
                    $scope.show = true;
                };

                // Hide dialog
                $scope.hideModal = function() {
                    $scope.show = false;
                };

                // "Approval"
                $scope.ok = function () {
                    $scope.hideModal();
                };

                // Close dialog
                $scope.close = function () {
                    $scope.hideModal();
                };

                // Listen dialog close requests
                $scope.$on(Signals.closeDialog.name, function (/*event, message*/) {
                    $scope.close();
                });

                // Root scope will hold the dialog scope
                $scope.$root.$dialog = $scope;
            }],
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {

                    $scope.title = $attrs.title || '';
                    $scope.okLabel = $attrs.okLabel || '';
                    $scope.closeLabel = $attrs.closeLabel || '';
                    $scope.launchTitle = $attrs.launchTitle || '';

                    $scope.dialogStyle = {};
                    if ($attrs.width) {
                        $scope.dialogStyle.width = $attrs.width;
                    }
                    if ($attrs.height) {
                        $scope.dialogStyle.height = $attrs.height;
                    }
                });
            },
            template: DialogTemplate
        };
    };

    return {
        feature: 'directive',
        name: 'appDialog',
        cls: AppDialog
    };
});
