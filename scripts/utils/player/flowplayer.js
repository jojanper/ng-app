/**
 * Video player using flowplayer.
 */
define([
    'common/toolbox',
    'flowplayer'
], function (Toolbox, flowplayer) {
    "use strict";

    var FlowPlayer = Toolbox.BaseClass.extend({
        constructor: function(options) {
            this.options = options;
            this.player = null;
        },

        getPlayer: function() {
            return this.player;
        },

        initPlayer: function(dataObject) {
            this.player = flowplayer(dataObject.$element.find('#player'), {
                playlist: dataObject.getPlaylist(),
                autoplay: true,
                preload: true
            });

            return this;
        }
    });

    return FlowPlayer;
});
