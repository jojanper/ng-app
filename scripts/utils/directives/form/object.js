define([
    './base_input',
    'utils/models/model'
], function (BaseInput, BaseModel) {
    "use strict";

    var ObjectInput = BaseInput.extend({

        type: 'object',

        // Reset is not allowed for the input
        fieldReset: undefined,

        _toHTML: function() {
            var html = '';

            /*
             * Create input control for each property within the object
             */
            var inputs = new BaseModel({inputDefs: [this.options]}).getInputs();
            for (var i = 0; i < inputs.length; i++) {
                html += '<app-input ref="' + inputs[i].name + '" auto-object></app-input>';
            }

            return html;
        }
    });

    return ObjectInput;
});
