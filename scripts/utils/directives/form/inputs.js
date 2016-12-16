define([
    'angular',
    './base_input',
    'common/html',
    './selector',
    './file',
    './object'
], function (ng, BaseInput, htmlLib, SelectorInput, FileInput, ObjectInput) {
    "use strict";

    var TextInput = BaseInput.extend({
        type: 'text',

        _toHTML: function() {
            // Form is view only
            if (this.options.$form.viewOnly) {
                var viewValue = this.getModelValue(this.$scope) || '';
                return '<div class="form-control view-only-control">' + viewValue + '</div>';
            }

            // Form can be read only and then editable
            var options = {
                type: this.type,
                name: this.options.name,
                class: this.inputClasses,
                'ng-model': this.modelRef(),
                'ng-disabled': '$form.readOnlyInput(this)'
            };

            var ngModelOptions = ng.toJson(this.getNgModelOptions());
            if (ngModelOptions.length > 2) { // Empty options are marked as "{}"
                options['ng-model-options'] = ngModelOptions;
            }

            options[this.directiveTag] = '';

            return htmlLib.input('', options);
        }
    });

    var EmailInput = TextInput.extend({
        type: 'email',

        _defaultValidators: function() {
            return ['email'];
        }
    });

    /**
     * Construct supported input types based on specified input objects.
     */
    var resolveInputs = function(allInputs) {
        var types = {};
        for (var i = 0; i < allInputs.length; i++) {

            // Input type definition is list of definitions
            if (Array.isArray(allInputs[i])) {
                for (var j = 0; j < allInputs[i].length; j++) {
                    types[allInputs[i][j].prototype.type] = allInputs[i][j];
                }
            }
            else {
                types[allInputs[i].prototype.type] = allInputs[i];
            }
        }

        return types;
    };

    return resolveInputs([TextInput, EmailInput, FileInput, SelectorInput, ObjectInput]);
});
