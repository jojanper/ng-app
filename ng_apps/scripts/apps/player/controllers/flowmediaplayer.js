define([
    'jquery',
    'utils/controllers/basecontroller',
    'text!./templates/mediaitem.html'
], function ($, BaseCtrl, MediaItemTemplate) {
    'use strict';

    var FlowMediaPlayerCtrl = BaseCtrl.extend({
        initialize: function($scope) {
            var self = this;

            $scope.mediaDetails = function(data, type, full, meta) {
                return $.sprintf(MediaItemTemplate,
                                 'https://i.ytimg.com/vi/DdHaZsmsTmE/hqdefault.jpg',
                                 'Heart Alone',
                                 full.name,
                                 1234567);
            };
        }
    });

    return {
        feature: 'controller',
        name: 'FlowMediaPlayerCtrl',
        cls: ['$scope', '$element', '$attrs', FlowMediaPlayerCtrl]
    };
});
