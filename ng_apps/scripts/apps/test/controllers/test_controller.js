/* global console: false */
define([
    './test_model',
    'utils/models/upload',
    'utils/models/model'
], function (TestModel, FileModel, BaseModel) {
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

    var TestController = function($scope, dialog, appLogger, appMessagesService) {

        $scope.uploadApi = backendConfig.urls.upload;

        $scope.addError = function() {
            appMessagesService.addMessage({
                type: "error",
                msgBody: errorMsg
            });
        };

        appLogger.info($scope);

        var adminModels = [
            {
                id: 'region',
                description: "Region",
                hide: true
            },
            {
                id: 'country',
                description: "Country"
            },
            {
                id: 'corporate',
                description: "Global corporates"
            },
            {
                id: 'moid',
                description: "Mobile Operator ID"
            },
            {
                id: 'mcc',
                description: "Mobile Country Code"
            },
            {
                id: 'mnc',
                description: "Mobile Network Code"
            },
            {
                id: 'countrygroup',
                description: "Country group"
            },
            {
                id: 'simlock',
                description: "SIM Lock"
            },
            {
                id: 'operator',
                description: "Operator"
            },
            {
                id: 'tradecustomer',
                description: "Trade customer"
            },
            {
                id: 'customer',
                description: "Customer"
            }
        ];

        $scope.selections = {
            data: adminModels
        };

        $scope.testSubmit = function (data) {
            console.log(data);
        };


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
            }, function() {
                console.log('Customer should not be deleted');
            });
        };


        /*
         * Launch dialog with template example.
         */

        $scope.openTemplateDialog = function () {
            dialog.showTemplateDialog($scope, 'ng-templates/test.html');
        };


        /*
         * Launch dialog with form example.
         */

        $scope.modelData = new TestModel();
        $scope.objectData = new TestModel();


        /*
         * Partial form example.
         */
        $scope.partialData = new TestModel();
    };

    return {
        feature: 'controller',
        name: 'TestController',
        cls: ['$scope', 'dialog', 'appLogger', 'appMessagesService', TestController]
    };
});
/* global console: true */
