define([
    'utils/controllers/basecontroller'
], function (BaseCtrl) {
    'use strict';

    var AudioViewController = BaseCtrl.extend({
    });

    return {
        feature: 'controller',
        name: 'AudioPlayerViewController',
        cls: ['$scope', '$element', '$attrs', '$state', AudioViewController]
    };
});
