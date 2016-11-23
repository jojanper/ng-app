define([
    'utils/loader',
    './controllers/test_controller'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'test.Test',
        dependencies: [],
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
