/**
 * Controller for video player.
 */
define([
    './basecontroller'
], function (BaseCtrl) {
    "use strict";

    var VideoPlayerCtrl = BaseCtrl.extend({

        initialize: function($scope) {
            var self = this;

            if (!$scope.options) {
                $scope.options = {};
            }

            this.playlist = [];

            $scope.initPlayer = function() {
                $scope.options.mediaLoader();
            };

            $scope.options.mediaLoader = function(params) {
                params = params || '';
                self.appUrlResolver.listingUrl(self.$attrs.model).then(function(dataObj) {
                    var url = dataObj.url + '?fields=id,type,url&call=video&mediaplayer=flow' + params;

                    self.network.get(url).then(function(data) {
                        self.setPlaylist(data);
                        self.player = self.playerlib.createFlowPlayer().initPlayer(self);
                        self.player.getPlayer().play(0);
                    });
                });
            };
        },

        setPlaylist: function(data) {
            var self = this;

            data.forEach(function(item) {
                (function(playlistItem) {
                    self.playlist.push({sources: [{
                        type: playlistItem.type,
                        src: playlistItem.url
                    }]});
                }(item));
            });

            return this.playlist;
        },

        getPlaylist: function() {
            return this.playlist;
        }
    });

    return {
        feature: 'controller',
        name: 'VideoPlayerCtrl',
        cls: ['$scope', '$element', '$attrs', 'appUrlResolver', 'network', 'playerlib', VideoPlayerCtrl]
    };
});
