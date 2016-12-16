(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'utils/models/upload'
    ];

    define(dependencies, function(AppBootstrap, UploadModel) {

        var $scope, $element, Upload, $httpBackend, $elementScope;

        function uploadSetup(html, callback) {
            beforeEach(inject(function($rootScope, $compile, _Upload_, _$httpBackend_) {
                Upload = _Upload_;
                $httpBackend = _$httpBackend_;

                if (callback) {
                    callback($httpBackend);
                }

                // Instantiate directive.
                var obj = AppTestUtils.ngCreateElement($rootScope, $compile, html);
                $scope = obj.$scope;
                $element = obj.$element;
                $elementScope = obj.$element.isolateScope() || obj.$element.scope();

                if (callback) {
                    $httpBackend.flush();
                }
            }));
        }

        var uploadApi = '/upload';
        var fileFormDataName = 'file';

        var formUploadHtml = '<file-upload model="upload" layout="form" upload-api="' + uploadApi + '" file-form-data-name=' +
                fileFormDataName + '></file-upload>';

        var dropboxUploadHtml = '<file-upload layout="dropbox" upload-api="' + uploadApi + '" file-form-data-name=' +
                fileFormDataName + '></file-upload>';

        describe('Upload directive using form layout', function() {

            AppTestUtils.appTestSetup.call(this);
            uploadSetup(formUploadHtml);

            it('initializes correctly', function() {
                expect($scope.uploadFiles).toEqual([]);
                expect($scope.fileModel).toEqual(jasmine.any(UploadModel));

                expect($scope.uploadApi).toEqual(uploadApi);

                expect($scope.fileChanged).toEqual(jasmine.any(Function));
                expect($scope.removeAll).toEqual(jasmine.any(Function));
                expect($scope.cancelAll).toEqual(jasmine.any(Function));
                expect($scope.upload).toEqual(jasmine.any(Function));

                expect($element.find('input')[0]).toBeDefined();
            });
        });

        describe('Upload directive using dropbox layout', function() {

            AppTestUtils.appTestSetup.call(this);
            uploadSetup(dropboxUploadHtml);

            it('initializes correctly', function() {
                expect($element.find('.drop-box').text().trim()).toEqual('Click to select files or drop files here');
            });
        });

        describe('Upload directive', function() {

            AppTestUtils.appTestSetup.call(this);
            uploadSetup(formUploadHtml);

            it('renders upload files correctly', function() {

                // GIVEN upload files
                $scope.uploadFiles = [
                    {
                        name: 'test',
                        statusText: '',
                        uploading: true
                    },
                    {
                        name: 'test2',
                        statusText: '',
                        uploading: true
                    }
                ];
                $scope.$digest();

                // WHEN locating files from UI
                var element = $element.find('tr');

                // THEN files should be rendered
                expect(element.length).toEqual(3); // 2 files + 1 thead tr

                // AND table has all needed elements
                expect($element.find('tbody td').length).toEqual($scope.uploadFiles.length * 5);
            });

            it('allows removing individual files', function() {

                // GIVEN upload files
                var data = [new Blob(['test', {type: 'image/jpeg'}])];
                $scope.fileChanged(data);
                $scope.$digest();

                // WHEN executing file removal
                expect($scope.uploadFiles.length).toEqual(1);
                var element = $element.find('td span');
                AppTestUtils.ngClick(element[0]);

                // THEN file should get removed from upload list
                expect($scope.uploadFiles.length).toEqual(0);
            });

            it('allows clearing of all uploaded files', function() {

                // GIVEN uploaded file
                $scope.uploadFiles = [{
                    name: 'test',
                    statusText: '',
                    uploading: false
                }];
                $scope.$digest();

                // WHEN locating clear button
                var element = $element.find('button');

                // THEN it should be present
                expect($(element[2]).text().trim()).toEqual('Remove all');

                // ---

                // WHEN clicking button to clear upload files
                AppTestUtils.ngClick(element[2]);

                // THEN upload files should be empty
                expect($scope.uploadFiles).toEqual([]);
            });

            it('allows cancellation of ongoing upload', function() {
                var aborted;

                // GIVEN on-going file upload
                $scope.uploadFiles = [{
                    name: 'test',
                    statusText: '',
                    uploading: true,
                    uploadHandle: {
                        abort: function() {
                            aborted = true;
                        }
                    }
                }];
                $scope.$digest();

                // WHEN clicking upload cancellation button
                var element = $element.find('td span');
                AppTestUtils.ngClick(element[0]);

                // THEN upload should have been cancelled
                expect(aborted).toBeTruthy();

                // AND some status text should be visible for the cancelled item
                expect($scope.uploadFiles[0].statusText.length > 0).toBeTruthy();
            });

            it('allows cancellation of all ongoing uploads', function() {
                var aborted1, aborted2;

                // GIVEN on-going file uploads
                $scope.uploadFiles = [
                    {
                        name: 'test',
                        statusText: '',
                        uploading: true,
                        uploadHandle: {
                            abort: function() {
                                aborted1 = true;
                            }
                        }
                    },
                    {
                        name: 'test2',
                        statusText: '',
                        uploading: true,
                        uploadHandle: {
                            abort: function() {
                                aborted2 = true;
                            }
                        }
                    }
                ];
                $scope.$digest();

                // WHEN clicking upload cancellation button
                var element = $element.find('button');
                AppTestUtils.ngClick(element[1]);

                // THEN uploads should have been cancelled
                expect($(element[1]).text().trim()).toEqual('Cancel all');
                expect(aborted1).toBeTruthy();
                expect(aborted2).toBeTruthy();

                // AND some status text should be visible for the cancelled item
                expect($scope.uploadFiles[0].statusText.length > 0).toBeTruthy();
                expect($scope.uploadFiles[1].statusText.length > 0).toBeTruthy();
            });

            it('uploading data succeeds', function() {

                spyOn($elementScope.$root, '$emit');

                // GIVEN new upload files
                var data = [new Blob(['test', {type: 'image/jpeg'}])];
                $scope.fileChanged(data);

                // WHEN executing upload
                $httpBackend.whenPOST(uploadApi).respond(200);
                $scope.upload();
                $httpBackend.flush();
                $scope.$digest();

                // THEN upload should succeed
                expect($scope.uploadFiles[0].uploading).toEqual(false);

                // AND table reload signal is emitted
                expect($elementScope.$root.$emit).toHaveBeenCalled();

                // AND upload files can be cleared from UI
                $scope.removeAll();
                expect($scope.uploadFiles.length).toEqual(0);
            });

            it('upload progress update', function() {

                // GIVEN on-going file upload
                var data = [new Blob(['test', {type: 'image/jpeg'}])];
                $scope.fileChanged(data);
                $httpBackend.whenPOST(uploadApi).respond(200);
                $scope.upload(data);

                // WHEN upload progress is updated
                var promise = $scope.uploadFiles[0].uploadHandle;
                promise.progressFunc({loaded: 60, total: 100});
                $httpBackend.flush();
                $scope.$digest();

                // THEN progress should be present
                expect($scope.uploadFiles[0].uploadProgress).toEqual(60);
            });

            it('uploading file fails', function() {

                var file = new Blob([''], {type: 'image/jpeg'});
                file.name = 'test';

                // GIVEN upload data
                var data = [file];
                $scope.fileChanged(data);

                // AND failure in upload
                $httpBackend.whenPOST(uploadApi).respond(404, {errors: ['This is error']});

                // WHEN calling upload function
                $scope.upload();
                $httpBackend.flush();
                $scope.$digest();

                // THEN error should be present
                var dataItem = $scope.uploadFiles[0];
                expect(dataItem.statusText.length > 0).toBeTruthy();

                // AND file name should be rendered to UI
                var element = $($element.find('tbody td')[1]).text().trim();
                expect(element.indexOf(data[0].name) > -1).toBeTruthy();

                $scope.$root.$apply();
            });

            it('upload data is empty', function() {

                // GIVEN empty upload data

                // WHEN calling upload function
                $scope.upload();
                $scope.$digest();

                // THEN no files should be uploaded
                expect($scope.uploadFiles).toEqual([]);
            });

            it('selection of new upload files triggers event', function(done) {

                // GIVEN file input
                var fileScope = $element.find('input[type=file]').scope();

                // WHEN new files have been selected for uploading
                fileScope.fileChanged([
                    new Blob(['test-upload.png'], {type: 'image/jpeg'}),
                    new Blob(['test2'], {type: 'audio/mp3'})
                ]);
                $scope.$digest();

                // THEN files should be available for UI rendering
                expect($scope.uploadFiles.length).toEqual(2);

                // AND image thumbnail is present
                expect($element.find('tbody td img').length).toEqual(1);

                // ----------

                // WHEN adding another set of new files for uploading
                fileScope.fileChanged([new Blob(['test3'], {type: 'image/jpeg'})]);
                $scope.$digest();

                // THEN old and new files should be available for UI rendering
                expect($scope.uploadFiles.length).toEqual(3);

                // AND image thumbnails are present
                expect($element.find('tbody td img').length).toEqual(2);

                setTimeout(function() {
                    // AND thumb src must be present for the first image
                    expect($scope.uploadFiles[0].thumbSrc.length > 0).toBeTruthy();
                    done();
                }, 400);
            });
        });

        describe('Upload view with file table view', function() {

            var tableUrl = '/api/generic/media/upload?draw=1&columns%5B0%5D%5Bdata%5D=name&columns' +
                    '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=' +
                    'true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=' +
                    'false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search' +
                    '%5Bvalue%5D=&search%5Bregex%5D=false';

            var tableHtml = '<app-table dt-server-side="true" model="upload">' +
                    '<app-column title="Name" data="name"></app-column>' +
                    '</app-table>';

            AppTestUtils.appTestSetup.call(this);
            uploadSetup(formUploadHtml + tableHtml, function($httpBackend) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
                $httpBackend.whenGET(tableUrl).respond(200, AppTestResponses.uploadResponseWithActions);
            });

            afterEach(function() {
                $scope.$destroy();
            });

            it('table data is reloaded when new file is available', function() {

                var tableObj = $($element[1]).scope().$parent.$$childTail.$$childTail.$$dataTable.ajax;
                spyOn(tableObj, 'reload').and.callThrough();

                // GIVEN new upload files
                var $uploadScope = $($element[0]).scope().$$childHead;
                var data = [new Blob(['test', {type: 'image/jpeg'}])];
                $uploadScope.fileChanged(data);

                // WHEN executing upload
                $httpBackend.whenPOST(uploadApi).respond(200);
                var reloadUrl = tableUrl.replace('draw=1', 'draw=2');
                $httpBackend.whenGET(reloadUrl).respond(200, AppTestResponses.uploadResponseWithActions);
                $uploadScope.upload();
                $httpBackend.flush();
                $uploadScope.$digest();

                // THEN table data should get updated
                expect(tableObj.reload).toHaveBeenCalled();
            });
        });
    });

})(define, describe);
