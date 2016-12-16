define([
    'text!./templates/file.html'
], function (FileTemplate) {
    "use strict";

    /**
     * @name fileUpload
     * @restrict E
     *
     * @description
     * File upload component.
     *
     * @param {string} uploadApi Upload API for files.
     * @param {string=} model Model name. If present, reload event is send when file uploading has finished.
     * @param {string} [layout=form] Layout mode. Supported modes:
     *
     *   * form: Traditional file input layout.
     *   * dropbox: Dropbox layout.
     *
     * @param {string} fileFormDataName File formdata name in 'Content-Disposition' header.
     *
     * @example
       <example>
         <file name="index.html">
           <file-upload layout="dropbox" upload-api="/upload" file-form-data-name="files[]"></file-upload>
         </file>
       </example>
     */
    var FileUpload = function () {

        return {
            template: FileTemplate,
            restrict: 'E',
            transclude: 'true',
            scope: {
            },
            controller: 'UploadCtrl',
            link: function ($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.layout = $attrs.layout || 'form';
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'fileUpload',
        cls: FileUpload,
        dependencies: ['ngFileUpload']
    };
});
