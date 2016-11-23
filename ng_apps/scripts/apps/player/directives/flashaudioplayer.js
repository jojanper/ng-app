define([
    'text!./templates/flashaudioplayer.html',
    'text!./templates/flowmediaplayer.html'
], function (FlashAudioPlayerTemplate, FlowMediaPlayerTemplate) {
    "use strict";

    function linkFunction($scope, $element, $attrs) {
        $scope.model = $attrs.model;
    }

    /**
     * @ngdoc directive
     * @name flashAudioPlayer
     * @restrict E
     *
     * @description
     * Audio player using flowplayer flash technology.
     *
     * @param {string} model Name of audio model.
     *
     * @example
       <example>
         <file name="index.html">
           <flash-audio-player model="audio"></flash-audio-player>
         </file>
       </example>
     */
    var FlashAudioPlayer = function () {
        return {
            restrict: 'E',
            template: FlashAudioPlayerTemplate,
            controller: 'FlashAudioPlayerCtrl',
            link: {
                pre: linkFunction
            }
        };
    };

    /**
     * @ngdoc directive
     * @name flowMediaPlayer
     * @restrict E
     *
     * @description
     * Media player using flowplayer as underlying player technology.
     *
     * @param {string} model Name of media model.
     *
     * @example
       <example>
         <file name="index.html">
           <flow-media-player model="video"></flow-media-player>
         </file>
       </example>
     */
    var FlowMediaPlayer = function () {
        return {
            restrict: 'E',
            template: FlowMediaPlayerTemplate,
            controller: 'FlowMediaPlayerCtrl',
            link: {
                pre: linkFunction
            }
        };
    };

    return [
        {
            componentName: 'flowplayer',

            feature: 'directive',
            name: 'flashAudioPlayer',
            cls: FlashAudioPlayer
        },

        {
            feature: 'directive',
            name: 'flowMediaPlayer',
            cls: FlowMediaPlayer
        }
    ];
});
