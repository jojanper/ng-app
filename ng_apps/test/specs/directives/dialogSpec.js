(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'apps/test/controllers/test_model'
    ];

    define(dependencies, function(AppBootstrap, TestModel) {

        describe('Dialog directive', function() {
            var submitted = false;

            // Instantiate element
            var element = '<app-dialog launch-title="Launch dialog with form" width="400px" height="400px" ok-label="Ok">' +
                    '<app-form submit-label="Send" clear-label="Reset" name="appForm2" model="modelData"' +
                    'submit-fn="testSubmit(data,url,success)" in-dialog></app-form>' +
                    '</app-dialog>';

            AppTestUtils.appTestSetup.call(this, element, function(scope) {
                scope.modelData = new TestModel();
                scope.testSubmit = function(data, url, success) {
                    submitted = true;
                    success();
                };
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                // Object input should be counted also although not shown in UI
                expect(this.$element.find('app-input').length).toEqual(this.$scope.modelData.getInputs().length);
                expect(this.$element.find('button').length).toEqual(6);
            });

            it('ESC key is pressed', function() {
                // GIVEN opened dialog
                AppTestUtils.click(this.$element.find('button:first-child'), this.$scope);

                // WHEN pressing ESC key
                var dialogScope = this.$element.find('.ng-modal-dialog').scope();
                spyOn(dialogScope, 'close');

                var esc = $.Event("keydown");
                esc.which = 27;
                this.$element.find('input').trigger(esc);
                this.$scope.$digest();

                // THEN dialog should get closed
                expect(dialogScope.close).toHaveBeenCalled();
            });

            it('launch and then close dialog', function() {
                // Open dialog
                AppTestUtils.click(this.$element.find('button:first-child'), this.$scope);

                // Close dialog from 'X' button
                var element = this.$element.find('.ng-modal-close');
                AppTestUtils.click(element[0], this.$scope);
                var scope = element.scope();
                expect(scope.show).toBeFalsy();
            });

            it('close dialog from Ok button', function() {
                var okButton = this.$element.find('button')[2];
                AppTestUtils.click(okButton, this.$scope);
                expect($(okButton).scope().show).toBeFalsy();
            });

            it('dialog form is submitted', function() {

                // Enable form submit
                this.$scope.modelData.name = 'test';
                this.$scope.$digest();

                // Submit the form
                var submitButton = this.$element.find('button')[1];
                AppTestUtils.click(submitButton, this.$scope);

                // Dialog is closed and submit callback is called
                expect(submitted).toBeTruthy();
                expect($(submitButton).scope().show).toBeFalsy();
            });

            it('dialog is closed via event', function() {

                // WHEN close signal is send
                this.$scope.$broadcast("close-dialog");

                // THEN dialog should be in closed state
                var okButton = this.$element.find('button')[2];
                expect($(okButton).scope().show).toBeFalsy();
            });
        });
    });

})(define, describe);
