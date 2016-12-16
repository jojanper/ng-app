/**
 * Audio player using flowplayer flash.
 */
define([
    'common/toolbox',
    'flowplayer-flash'
], function (Toolbox) {
    "use strict";

    var FlashPlayer = Toolbox.BaseClass.extend({
        constructor: function(options) {
            this.options = options;
            this.player = null;
        },

        initPlayer: function(dataObject) {
            this.player = flowplayer(this.options.playerId, "/static/flow/3.2.18/flowplayer-3.2.18.swf", {
                playlist: dataObject.getPlaylist(),
                clip: {
                    autoPlay: true,
                    autoBuffering: true,

                    onBeforeBegin: function() {
                        this.stop();
                    },

                    onFinish: function(clip) {
                        if (dataObject.onFinish) {
                            dataObject.onFinish(clip);
                        }
                    },

                    onStart: function(clip) {
                        if (dataObject.onStart) {
                            dataObject.onStart(clip);
                        }
                    }
                },

                plugins:  {
                    audio: {
                        url: "/static/flow/3.2.18/flowplayer.audio-3.2.11.swf"
                    },

                    // controlbar skinning
                    controls: {
                        url: '/static/flow/3.2.18/flowplayer.controls-3.2.16.swf',
                        playlist: true,
                        backgroundColor: '#330033',
                        height: 30,
                        fullscreen: false,
                        autoHide: false
                    }
                }
            });

            return this;
        },

        playClipIndex: function(playIndex) {
            var clip = this.player.getClip(playIndex);
            this.player.play(clip.index);
        },

        clearPlaylist: function() {
            try {
                this.player.setPlaylist([]);
            }
            catch(error) {
            }
        }
    });

    return FlashPlayer;
});
