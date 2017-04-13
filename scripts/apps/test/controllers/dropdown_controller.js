/* global console: false */
define([
], function () {
    "use strict";

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

    var TestDropdownController = function($scope, dialog, appLogger, appMessagesService) {

        $scope.addError = function() {
            appMessagesService.addMessage({
                type: "error",
                msgBody: errorMsg
            });
        };

        $scope.addSuccess = function() {
            appMessagesService.addMessage({
                type: "success",
                msgBody: 'Check your email! An activation link has been sent to the email address you supplied, ' +
                    'along with instructions for activating your account.'
            });
        };

        appLogger.info($scope);

        /*
         * Dropdown menu example.
         */

        $scope.menuItems = [
            {
                callback: function() {
                    console.log('Menu 1');
                },
                text: 'The first choice!'
            },
            {
                callback: function() {
                    console.log('Menu 2');
                },
                text: 'And another choice for you.'
            },
            {
                callback: function() {
                    console.log('Menu 3');
                },
                text: 'but wait! A third!'
            },
            {
                divider: true
            },
            {
                link: '#/home',
                text: 'This is a link'
            }
        ];


        /*
         * Checkbox dropdown menu example.
         */

        $scope.checkboxMenuItems = ['One', 'Two', 'Three'];
        $scope.checkboxOnChange = function(index, status) {
            console.log(index);
            console.log(status);
        };


        /*
         * Launch dialog example.
         */

        $scope.openDialog = function () {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            dialog.showTextDialog(modalOptions).then(function (result) {
                console.log('Delete customer');
            }).catch(function() {
                console.log('Customer should not be deleted');
            });
        };
    };

    return {
        feature: 'controller',
        name: 'TestDropdownController',
        cls: ['$scope', 'dialog', 'appLogger', 'appMessagesService', TestDropdownController]
    };
});
/* global console: true */
