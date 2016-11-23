define([
    'utils/loader',
    './controllers/audiocontroller',
    './controllers/videocontroller',
    './controllers/flashaudioplayer',
    './controllers/flowmediaplayer',
    './directives/flashaudioplayer'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'player',
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
