define([
    'utils/controllers/basecontroller'
], function (BaseCtrl) {
    'use strict';

    var FlashAudioPlayerController = BaseCtrl.extend({
        initialize: function($scope) {
            var self = this;

            $scope.show = false;
            $scope.showSongSelection = true;

            this.loadAudio = function(callParam) {
                // Show search box
                $scope.show = true;

                // Search callback
                $scope.loadBySearch = function(search) {
                    if (search.length) {
                        // Load new music based on search text
                        $scope.options.audioLoader('&' + callParam + '=' + search);

                        // Hide song selection dropdown menu and possible search box
                        $scope.show = $scope.showSongSelection = false;
                    }
                };
            };

            $scope.menuItems = [
                {
                    callback: function() {
                        // Load all music belonging to user
                        $scope.show = false;
                        $scope.options.audioLoader('');
                        $scope.showSongSelection = false;
                    },
                    text: 'My music'
                },
                {
                    callback: function() {
                        // Load music based on song name
                        self.loadAudio('by_name');
                    },
                    text: 'Based on name'
                },
                {
                    callback: function() {
                        // Load music based on artist name
                        self.loadAudio('by_artist');
                    },
                    text: 'Based on artist'
                }
            ];
        }
    });

    return {
        feature: 'controller',
        name: 'FlashAudioPlayerCtrl',
        cls: ['$scope', '$element', '$attrs', FlashAudioPlayerController]
    };
});
