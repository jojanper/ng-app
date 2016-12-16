define([
    './test_model',
    'utils/models/upload'
], function (TestModel, FileModel) {
    "use strict";

    var TestFormController = function($scope, dialog) {

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
        name: 'TestFormController',
        cls: ['$scope', 'dialog', TestFormController]
    };
});
