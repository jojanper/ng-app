/**
 * Controller for audio player.
 */
define([
    './basecontroller',
    'utils/common/signals',
    'common/utils',
    'utils/models/model'
], function (BaseCtrl, Signals, UtilsLib, BaseModel) {
    "use strict";

    var AudioPlayerCtrl = BaseCtrl.extend({

        initialize: function($scope) {
            var self = this;

            if (!$scope.options) {
                $scope.options = {};
            }

            $scope.options.audioLoader = function(params) {
                self.$scope.currentSong = '';
                self.appUrlResolver.listingUrl(self.$attrs.model).then(function(dataObj) {
                    var url = dataObj.url + '?fields=id,name,url&call=audio&mediaplayer=flash' + params;

                    self.network.get(url).then(function(data) {
                        $scope.model.setSelectorList('playlist', self.setPlaylist(data, $scope));
                        self.player = self.playerlib.createFlashPlayer({playerId: self.playerId}).initPlayer(self);
                    });
                });
            };

            // Audio playlist
            $scope.playlist = [];

            /*
             * Model object for selecting audio clip from selector dropdown component. This represents
             * the model for form component where only one (selector) input is present.
             */
            $scope.model = new BaseModel({
                data: {
                    playlist: null
                },
                inputDefs: [{
                    name: 'playlist',
                    type: "selector",
                    placeholder: 'Select audio clip...',
                    selector: {
                        displayKey: 'clipData.name',
                        selectorList: []
                    },
                    onChange: function($item) {
                        self.player.playClipIndex($item.index);
                    }
                }]
            });

            $scope.currentSong = '';
            $scope.playListTemplate = 'ng-templates/audio-playlist-popover.html';

            /**
             * Initialize audio player.
             */
            $scope.initPlayer = function(playerId) {
                self.playerId = playerId;
            };

            $scope.showSelection = function() {
                $scope.showSongSelection = !$scope.showSongSelection;
            };
        },

        setPlaylist: function(data, $scope) {
            for (var i = 0; i < data.length; i++) {
                data[i] = {
                    index: i,
                    url: data[i].url,
                    clipData: data[i],
                    provider: 'audio'
                };
            }

            $scope.playlist = data;

            return $scope.playlist;
        },

        getPlaylist: function() {
            return this.$scope.playlist;
        },

        onFinish: function(clip) {
        },

        onStart: function(clip) {
            var self = this;
            this.$scope.$apply(function() {
                self.$scope.model.playlist = clip;
                self.$scope.currentSong = clip.clipData.name;
            });
        }
    });

    return {
        feature: 'controller',
        name: 'AudioPlayerCtrl',
        cls: ['$scope', '$element', '$attrs', 'appUrlResolver', 'network', 'playerlib', AudioPlayerCtrl],
        run: ['$templateCache', '$http', function($templateCache, $http) {

            if (backendConfig.isTestRunner) {
                return;
            }

            // Preload the audio playlist popover template to provide smooth experience
            $http.get('ng-templates/audio-playlist-popover.html', {cache: $templateCache});
        }]
    };
});
