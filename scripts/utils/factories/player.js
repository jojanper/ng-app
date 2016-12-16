define([
    'utils/player/flashplayer',
    'utils/player/flowplayer'
], function (FlashPlayer, FlowPlayer) {
    "use strict";

    var name = 'playerlib';

    /**
     * @ngdoc service
     * @name playerlib
     *
     * @description
     * Player factory.
     */
    var PlayerFactory = function() {
        return {
            $$name: name,

            /**
             * @ngdoc
             * @name playerlib#createFlashPlayer
             * @methodOf playerlib
             *
             * @description
             * Create flash player.
             *
             * @param {Object} options Player options.
             * @param {Object} options.playerId Player ID.
             * @return {Object} Player object.
             *
             * @example
               <pre>
                 var playerObj = playerlib.createFlashPlayer({playerId: playerId});
               </pre>
             */
            createFlashPlayer: function(options) {
                return new FlashPlayer(options);
            },

            /**
             * @ngdoc
             * @name playerlib#createFlowPlayer
             * @methodOf playerlib
             *
             * @description
             * Create flowplayer.
             *
             * @param {Object} options Player options.
             * @return {Object} Player object.
             *
             * @example
               <pre>
                 var playerObj = playerlib.createFlowPlayer();
               </pre>
             */
            createFlowPlayer: function(options) {
                return new FlowPlayer(options);
            }
        };
    };

    return {
        feature: 'factory',
        name: name,
        cls: PlayerFactory
    };
});
