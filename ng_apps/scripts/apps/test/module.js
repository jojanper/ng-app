define([
    'utils/loader',
    './controllers/dropdown_controller',
    './controllers/fileupload_controller',
    './controllers/forms_controller',
    './controllers/tables_controller'
], function (ModuleLoader) {

    return new ModuleLoader({
        name: 'test.Test',
        dependencies: [],
        modules: Array.prototype.slice.call(arguments, 1)
    }).getModule();
});
