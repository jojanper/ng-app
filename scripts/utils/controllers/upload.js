/**
 * Controller for element visibility changes etc.
 */
define([
    './basecontroller',
    'utils/common/signals',
    'utils/models/upload',
    'common/utils'
], function (BaseCtrl, Signals, UploadModel, UtilsLib) {
    "use strict";

    var UploadCtrl = BaseCtrl.extend({

        initialize: function() {
            var self = this;
            var Upload = this.arguments[0];

            // Upload container
            this.$scope.uploadFiles = [];

            // File model for form layout
            this.$scope.fileModel = new UploadModel({multiple: true});

            // HTTP parameters; remote api and files identifier name for HTTP POST
            this.$scope.uploadApi = this.$attrs.uploadApi || '/multi-upload';
            var fileFormDataName = this.$attrs.fileFormDataName || 'files[]';

            /**
             * Add new files to file upload container.
             *
             * @param {array.<object>} $files Files to include for uploading.
             */
            this.addFiles = function($files) {
                if ($files && $files.length) {

                    // New files are appended to existing buffer
                    var offset = this.$scope.uploadFiles.length;
                    for (var i = offset; i < offset + $files.length; i++) {
                        (function(file, index) {
                            self.$scope.uploadFiles.push({
                                index: index,
                                statusText: '',
                                delete: true,
                                uploading: false,
                                uploaded: false,
                                uploadProgress: 0,
                                file: file,
                                uploadHandle: null,
                                fileInfo: UtilsLib.File.fileInfo(file),
                                thumbSrc: ''
                            });

                            (function(item) {
                                if (item.fileInfo.isImage) {
                                    self.imagelib.readAsDataUrl(file, self.$scope).then(function(dataUrl) {
                                        item.thumbSrc = dataUrl;
                                    });
                                }
                            }) (self.$scope.uploadFiles[self.$scope.uploadFiles.length - 1]);

                        }) ($files[i - offset], i);
                    }
                }
            };

            /**
             * Add new files for uploading. Function will get called every time user has selected new files.
             *
             * @param {array.<object>} $files Files to include for uploading.
             */
            this.$scope.fileChanged = function($files) {
                self.addFiles($files);
            };

            /**
             * Start file uploading.
             *
             * @param {object} item File item to upload.
             * @param {object|null} Upload object.
             */
            this.startUpload = function(item) {
                var ret = null;

                if (!(item.uploading || item.uploaded || item.statusText)) {
                    item.uploading = true;
                    item.delete = false;

                    var data = {};
                    data[fileFormDataName] = item.file;

                    ret = Upload.upload({
                        url: this.$scope.uploadApi,
                        data: data
                    }).then(function () {
                        // Upload done
                        item.uploading = false;
                        item.uploaded = true;

                        if (self.$attrs.model) {
                            // Send signal to associated tables to indicate that new upload data is available
                            var signal = new Signals.tableReload.cls(self.$scope, {model: self.$attrs.model});
                            self.$scope.$root.$emit(Signals.tableReload.name, signal);
                        }

                    }, function(response) {
                        var data = response.data;

                        // Upload error
                        item.uploading = false;
                        item.statusText = (data && data.errors) ? data.errors[0] : '';
                    }, function (evt) {
                        // Update progress
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        item.uploadProgress = progressPercentage;
                    });
                }

                return ret;
            };

            /**
             * Check if file item can be uploaded.
             *
             * @param {object} item File upload item.
             * @param {boolean} true if upload is allowed, false otherwise.
             */
            this.canUploadItem = function(item) {
                // Ongoing upload or already uploaded item are not allowed
                return !(item.uploading || item.uploaded);
            };

            /**
             * Check any of the files have not yet been uploaded.
             *
             * @param {boolean} true if uploaded items exist, false otherwise.
             */
            this.canUpload = function() {
                for (var i = 0; i < this.$scope.uploadFiles.length; i++) {
                    if (this.canUploadItem(this.$scope.uploadFiles[i])) {
                        return true;
                    }
                }

                return false;
            };

            /**
             * Check if cancellation if allowed for any of the files.
             *
             * @param {boolean} true if cancellable items exist, false otherwise.
             */
            this.canCancelAll = function() {
                // Cancelling is possible if at least at least one file is being uploaded at the moment
                for (var i = 0; i < this.$scope.uploadFiles.length; i++) {
                    if (this.$scope.uploadFiles[i].uploading) {
                        return true;
                    }
                }

                return false;
            };

            /**
             * Check removing all upload files from UI is allowed.
             *
             * @param {boolean} true if removal is allowed, false otherwise.
             */
            this.canRemoveAll = function() {
                // Must have upload items and no ongoing upload present
                return this.$scope.uploadFiles.length && !this.canCancelAll();
            };

            /**
             * Remove all upload files from UI.
             */
            this.$scope.removeAll = function() {
                if (self.canRemoveAll()) {
                    self.$scope.uploadFiles = [];
                }
            };

            /**
             * Cancel all ongoing file uploads.
             */
            this.$scope.cancelAll = function() {
                if (self.canCancelAll()) {
                    for (var i = 0; i < self.$scope.uploadFiles.length; i++) {
                        self.$scope.cancelUpload(self.$scope.uploadFiles[i]);
                    }
                }
            };

            /**
             * Start upload process for all pending file items.
             */
            this.$scope.upload = function() {
                if (self.canUpload()) {
                    for (var i = 0; i < self.$scope.uploadFiles.length; i++) {
                        (function(item) {
                            item.uploadHandle = self.startUpload(item);
                        }) (self.$scope.uploadFiles[i]);
                    }
                }
            };

            /**
             * Remove individual file item from upload list.
             *
             * @param {object} item File upload item.
             */
            this.$scope.removeItem = function(item) {
                // Remove details from local storage (which updates then the UI).
                for (var index = 0; index < self.$scope.uploadFiles.length; index++) {
                    if (self.$scope.uploadFiles[index].index === item.index) {
                        self.$scope.uploadFiles.splice(index, 1);
                        break;
                    }
                }
            };

            /**
             * Cancel individual file item upload.
             *
             * @param {object} item File upload item.
             */
            this.$scope.cancelUpload = function(item) {
                item.uploading = false;
                item.uploadProgress = 0;
                item.uploadHandle.abort();
                item.statusText = '(Cancelled)';
            };

            // New files has been selected for uploading
            var unregisterFn = this.$scope.$root.$on(Signals.uploadFilesChanged.name, function(event, signalObj) {
                self.addFiles(signalObj.data.files);
            });

            /*
             * Manually unregister event listener.
             * This is needed since $rootScope is never destroyed during the lifetime of the application.
             */
            this.$scope.$on('$destroy', unregisterFn);
        }
    });

    return {
        feature: 'controller',
        name: 'UploadCtrl',
        cls: ['$scope', '$element', '$attrs', 'Upload', 'imagelib', UploadCtrl],
        dependencies: ['ngFileUpload']
    };
});
