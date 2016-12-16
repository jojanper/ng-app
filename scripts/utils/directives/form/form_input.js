define([
    'angular',
    'common/html',
    './base',
    './inputs'
], function (ng, htmlLib, BaseInput, Inputs) {
    "use strict";

    var LabelInput = BaseInput.extend({
        toHTML: function() {
            var label = (this.options.noLabel === true) ? '&nbsp' : this.options.label;

            return htmlLib.label(label, {
                for: this.options.name,
                class: 'form-label',
                'uib-tooltip': this.options.help || ''
            });
        }
    });

    var FormInput = BaseInput.extend({

        constructor: function($scope, options) {
            this.$scope = $scope;
            this.options = options;
            this.inputObjs = Inputs;
            this.initialize();

            this.options = ng.extend(this.options, {$scope: this.$scope});
        },

        initialize: function() {
        },

        resetValue: function(model, field) {
            new this.inputObjs[this.options.type](this.options).resetValue(model, field);
        },

        toHTML: function() {
            var type = this.options.type;
            if (this.inputObjs[type]) {

                // Set up label for the input
                var html = (this.options.noInputLabel === true) ? '' : new LabelInput(this.options).toHTML();

                // The actual input HTML
                var inputObj = new this.inputObjs[type](this.options);
                html += ' ' + inputObj.toHTML(this.$scope);

                // Input may have controller attached
                inputObj.inputController(this.$scope);

                // Wrap everything around div element
                return htmlLib.div(html, {
                    class: "form-group"
                });
            }

            throw new Error("Invalid input type: " + type);
        }
    });

    return FormInput;
});
