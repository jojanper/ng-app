(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'apps/test/controllers/test_model'
    ];

    define(dependencies, function(AppBootstrap, TestModel) {

        var appName = 'app';
        var $rootScope, dialog;
        var success = false, cancel = false;

        describe('Dialog factory - showTextDialog', function() {

            beforeEach(module(appName));

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            beforeEach(inject(function(_$rootScope_, _dialog_) {
                dialog = _dialog_;
                $rootScope = _$rootScope_;

                dialog.showTextDialog(modalOptions).then(function (result) {
                    success = true;
                }, function() {
                    cancel = true;
                });
                $rootScope.$digest();
            }));

            afterEach(function() {
                $('.modal').remove();
            });

            it('confirmation button is clicked', function() {
                $($('body').find('.modal-footer > button')[1]).click();
                expect(success).toBeTruthy();
            });

            it('cancel button is clicked', function() {
                $($('body').find('.modal-footer > button')[0]).click();
                expect(cancel).toBeTruthy();
            });
        });

        describe('Dialog factory - showTemplateDialog', function() {

            // Load new module containing templates
            beforeEach(module("app.templates"));

            beforeEach(module(appName));

            var $scope;

            beforeEach(inject(function(_$rootScope_, _dialog_) {
                dialog = _dialog_;
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();
                $scope.modelData = new TestModel();
                dialog.showTemplateDialog($scope, 'ng-templates/test.html');
                $rootScope.$digest();
            }));

            afterEach(function() {
                $scope.$destroy();
                $('.modal-backdrop').remove();
            });

            it('initializes correctly', function() {
                // Form name in 'ng-templates/test.html' is 'appForm2'
                var form = $('form[name="appForm2"]');
                expect(form.find('app-input').length).toEqual(7);
                expect(form.find('button').length).toEqual(2);
            });
        });

        describe('Dialog factory - showModal', function() {

            beforeEach(module(appName));

            beforeEach(inject(function(_$rootScope_, _dialog_) {
                _dialog_.showModal();
                _$rootScope_.$digest();
            }));

            afterEach(function() {
                $('.modal').remove();
            });

            it('initializes correctly', function() {
                expect($('body .modal-footer').text().replace(/\s+/g, '')).toEqual('');
            });
        });
    });

})(define, describe);
