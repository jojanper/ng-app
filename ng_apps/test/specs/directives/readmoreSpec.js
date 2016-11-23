(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    var moreMsg = 'Test message from controller. I am quite new to AngularJs. I am working on a ' +
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

        describe('ReadMore directive', function() {

            var $scope, $element;

            beforeEach(module(appName));

            beforeEach(function() {

                inject(function($rootScope, $compile) {

                    // Instantiate directive.
                    var element = '<read-more ng-bind-html="moreMsg"></read-more>';
                    var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                        scope.moreMsg = moreMsg;
                    });
                    $scope = obj.$scope;
                    $element = obj.$element;

                    // Need to add the element to DOM
                    $('body').append($element);
                });
            });

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                expect($element.text()).toContain(moreMsg);
            });
        });
    });

})(define, describe);
