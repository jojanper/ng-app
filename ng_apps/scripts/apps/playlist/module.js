define([
    'utils/loader',
    './controllers/playlists',
    './controllers/edit'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'playlists',
        dependencies: ['ngSanitize', 'ui.select'],
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
