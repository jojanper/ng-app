define([
    'angular',
    'jquery',
    'common/toolbox'
], function (angular, $, Toolbox, EditDialogTemplate) {
    'use strict';

    var PlaylistEditController = Toolbox.BaseClass.extend({
        constructor: function($scope) {
            this.$scope = $scope;

            this.$scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        }
    });

    return {
        feature: 'controller',
        name: 'PlaylistEditController',
        cls: ['$scope', PlaylistEditController]
    };
});
