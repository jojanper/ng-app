define([
], function () {
    "use strict";

    var TestFileUploadController = function($scope) {
        $scope.uploadApi = backendConfig.urls.upload;
    };

    return {
        feature: 'controller',
        name: 'TestFileUploadController',
        cls: ['$scope', TestFileUploadController]
    };
});
