define(['angular'], function (angular) {

    /**
     * Module loader for Angular. The options should contain following attributes:
     *  - name: Name of the module
     *  - modules: List of objects containing angular module definitions.
     *             Each item definition may contain one or more definitions for that particular
     *             module. All items should have the following keys defined:
     *               - feature: Module type (directive, controller, service, factory, etc)
     *               - name: Name of module.
     *               - cls: Module class definition.
     *               - dependencies: Module dependencies.
     *               - run: Run block implementation.
     *               - constant: Constant block implementation.
     *               - config: Config block implementation.
     *            If item definition contains multiple subitem definitions, the the following
     *            keys must be present for the first subitem definition:
     *               - component_name: Name of module for the subitem module definitions.
     *               - component_dependencies: Dependencies for the module containing subitem modules.
     *  - dependencies: List of dependencies to other modules, if any
     */
    function ModuleLoader(options) {

        this.options = options;

        this._setupModule = function() {
            var dependencies = [];
            var args = this.options.modules;

            for (var i = 0; i < args.length; i++) {
                var data = args[i];
                var multiple = false;
                var componentDependencies = [];
                var prefix = this.options.name;

                if (!Array.isArray(data)) {
                    data = [data];
                }

                /*
                 * Module is created by first defining the subitem modules and then
                 * using those as dependencies for the parent module.
                 */
                else {
                    multiple = true;
                    prefix += '.' + data[0].componentName;
                }

                // List of angular feature declarations
                for (var j = 0; j < data.length; j++) {
                    var arg = data[j];

                    var name = prefix + '.' + arg.name;
                    componentDependencies.push(name);
                    var subApp = angular.module(name, arg.dependencies || []);

                    // Configure controller, directive, factory, service or filter
                    var module = subApp[arg.feature](arg.name, arg.cls);

                    // module.run()
                    if (arg.run) {
                        module.run(arg.run);
                    }

                    // module.config()
                    if (arg.config) {
                        module.config(arg.config);
                    }

                    // module.constant()
                    if (arg.constant) {
                        module.constant(arg.constant[0], arg.constant[1]);
                    }
                }

                if (!multiple) {
                    // Dependencies for upper level
                    dependencies = dependencies.concat(componentDependencies);
                }
                else {
                    // Create the parent for the subitem modules
                    angular.module(prefix, componentDependencies.concat(data[0].componentDependencies || []));

                    // Parent as dependency for the upper level
                    dependencies.push(prefix);
                }
            }

            // Create parent for the defined modules
            dependencies.concat(this.options.dependencies || []);
            angular.module(this.options.name, dependencies);
        };

        this.getModule = function() {
            return this.options.name;
        };

        this._setupModule();
    }

    return ModuleLoader;
});
