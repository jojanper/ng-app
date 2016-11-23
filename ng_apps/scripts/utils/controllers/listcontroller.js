define([
    'utils/controllers/basecontroller'
], function (BaseCtrl) {
    'use strict';

    var ListController = BaseCtrl.extend({
        initialize: function($scope) {
            var self = this;
        }
    });

    return {
        feature: 'controller',
        name: 'ListController',
        cls: ['$scope', '$element', '$attrs', '$state', ListController]
    };
});
