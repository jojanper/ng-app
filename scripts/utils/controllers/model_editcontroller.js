define([
    'utils/controllers/editcontroller'
], function (EditCtrl) {
    'use strict';

    var EditController = EditCtrl.extend({
        editInitialize: function($scope) {
            var self = this;
        }
    });

    return {
        feature: 'controller',
        name: 'EditController',
        cls: ['$scope', '$element', '$attrs', '$stateParams', '$state', EditController]
    };
});
