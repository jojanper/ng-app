define([
    './base_input',
    'text!./templates/file.html',
    'utils/common/signals'
], function (BaseInput, FileInputTemplate, Signals) {
    "use strict";

    var FileInput = BaseInput.extend({
        type: 'file',
        template: FileInputTemplate,

        controller: function($scope) {

            // Which media to select from popup window
            $scope.accept = this.options.accept || '*/*';

            // Is multiple file selection allowed
            $scope.multipleFiles = $scope.model.multipleFiles();

            // Is drag&drop supported
            $scope.dragDrop = this.options.dragDrop;

            // Called when files are selected, dropped, or cleared
            $scope.fileChanged = function($files) {
                if ($files) {
                    // Send signal to indicate that new files have been selected for uploading
                    var signal = new Signals.uploadFilesChanged.cls($scope, {files: $files});
                    $scope.$root.$emit(Signals.uploadFilesChanged.name, signal);
                }
            };
        }
    });

    return FileInput;
});
