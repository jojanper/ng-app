define([
    'utils/controllers/basecontroller',
    'flowplayer'
], function (BaseCtrl) {
    'use strict';

    var VideoViewController = BaseCtrl.extend({
    });

    return {
        feature: 'controller',
        name: 'VideoPlayerViewController',
        cls: ['$scope', '$element', '$attrs', '$state', VideoViewController]
    };
});
