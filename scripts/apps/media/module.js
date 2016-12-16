define([
    'utils/loader'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'media',
        dependencies: ['ngSanitize', 'ui.select'],
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
