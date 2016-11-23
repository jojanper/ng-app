define([
    'jquery',
    'text!./templates/audioplayer.html',
    'text!./templates/videoplayer.html'
], function ($, AudioPlayerTemplate, VideoPlayerTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name audioPlayer
     * @restrict E
     *
     * @description
     * Audio player.
     *
     * @param {string} model Name of audio model.
     * @param {string} options Player options object as assignable angular expression.
     * @param {function} options.audioLoader Audio loader callback function for parent scope created by the directive.
     * @param {string} showSongSelection Status of song selection element as assignable angular expression.
     *
     * @example
       <example>
         <file name="index.html">
           <audio-player></audio-player>
         </file>
       </example>
     */
    var AudioPlayer = function () {
        return {
            restrict: 'E',
            scope: {
                options: '=',
                showSongSelection: '='
            },
            template: AudioPlayerTemplate,
            controller: 'AudioPlayerCtrl',
            link: function ($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.initPlayer("player");
                });
            }
        };
    };

    /**
     * @ngdoc directive
     * @name videoPlayer
     * @restrict E
     *
     * @description
     * Video player.
     *
     * @param {string} model Name of video model.
     * @param {string} options Player options object as assignable angular expression.
     * @param {function} options.videoLoader Video loader callback function for parent scope created by the directive.
     *
     * @example
       <example>
         <file name="index.html">
           <video-player></video-player>
         </file>
       </example>
     */
    var VideoPlayer = function () {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            template: VideoPlayerTemplate,
            controller: 'VideoPlayerCtrl',
            link: function ($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.initPlayer();
                });
            }
        };
    };

    return [
        {
            componentName: 'player',

            feature: 'directive',
            name: 'audioPlayer',
            cls: AudioPlayer
        },
        {
            feature: 'directive',
            name: 'videoPlayer',
            cls: VideoPlayer
        }
    ];
});
