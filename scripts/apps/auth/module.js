define([
    'utils/loader',
    './controllers/login'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'auth',
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
