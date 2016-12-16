(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    var errorMsg = 'Test message from controller. I am quite new to AngularJs. I am working on a ' +
        'Q&A Application where i have to render some questions and its answers in the form of ' +
        'a table. I have three Types of questions which I have to render in a different way. ' +
        'Every question has a type assigned with it. If question.type is "MCQ" then the options ' +
        'or its answer should be rendered with HTML checkbox, and if question type is NUM its answers ' +
        'should be rendered with radio buttons. i tried this and use if conditions in AngularJs Template. ' +
        'my code is Test message from controller. I am quite new to AngularJs. I am working on a Q&A ' +
        'Application where i have to render some questions and its answers in the form of a table. ' +
        'I have three Types of questions which I have to render in a different way. Every question has ' +
        'a type assigned with it. If question.type is "MCQ" then the options or its answer should be ' +
        'rendered with HTML checkbox, and if question type is NUM its answers should be rendered with ' +
        'radio buttons. i tried this and use if conditions in AngularJs Template. my code is';

    define(dependencies, function(AppBootstrap) {

        var appName = 'app';

        describe('Appmessages service', function() {

            beforeEach(module(appName));

            var $scope, $element, appMessagesService;

            beforeEach(function(done) {

                inject(function($rootScope, $compile, _appMessagesService_) {
                    appMessagesService = _appMessagesService_;

                    // Instantiate directive.
                    var element = '<app-messages close-speed=0></app-messages>';

                    var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element);
                    $scope = obj.$scope;
                    $element = obj.$element;
                });

                done();
            });

            afterEach(function() {
                $scope.$destroy();

                var messages = appMessagesService.getMessages();
                for (var i = 0; i < messages.length; i++) {
                    appMessagesService.removeMessage(0);
                }
            });

            it('initializes correctly', function(done) {
                expect($($element[0]).html()).toContain('<!-- ngRepeat: alert in appMessagesCtrl.alerts -->');
                done();
            });

            it('new message is added to service', function(done) {

                // GIVEN messages service

                // WHEN new message is added
                appMessagesService.addMessage({
                    type: "error",
                    msgBody: errorMsg
                });
                $scope.$digest();

                // THEN it should appear in UI
                expect($element.find('.alert-message-body').length).toEqual(1);

                done();
            });

            it("message is removed", function(done) {

                // GIVEN message
                appMessagesService.addMessage({
                    type: "error",
                    msgBody: errorMsg
                });
                $scope.$digest();

                // WHEN message is removed
                AppTestUtils.ngClick($element.find('remove-on-click')[0]);
                $scope.$digest();

                // THEN service has no messages
                expect(appMessagesService.getMessages.length).toEqual(0);

                setTimeout(function() {
                    done();
                }, 500);
            });
        });
    });

})(define, describe);
