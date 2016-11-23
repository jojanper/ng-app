define([
    'angular',
    './base',
    './input_vds',
    'common/html'
], function (ng, BaseInput, InputValidatorMap, htmlLib) {
    "use strict";

    var InputValidators = BaseInput.extend({
        validateClasses: 'label label-danger form-input-error',
        validators: InputValidatorMap,

        toHTML: function($scope, formRef) {
            var self = this;
            var validators = [];

            if (this.options.validators) {
                ng.forEach(this.options.validators, function(value) {
                    var validator;
                    if (ng.isObject(value)) {
                        validator = self.validators[value.type];
                    }
                    else {
                        validator = self.validators[value];
                    }

                    if (validator && validator.errorTemplate) {
                        var obj = validator.errorTemplate.call(self, $scope, value);
                        if (ng.isObject(obj)) {
                            var errorCondition = '';

                            if (obj.errorRef) {
                                errorCondition = '.$error.' + obj.errorRef;
                            }
                            else if (obj.ref) {
                                errorCondition = obj.ref;
                            }

                            obj = htmlLib.span(obj.text, {
                                class: self.validateClasses,
                                'ng-show': formRef + errorCondition + ' && !$form.readOnlyInput(this)'
                            });
                        }

                        this.push(obj);
                    }

                }, validators);
            }

            return validators.join(' ');
        }
    });

    return InputValidators;
});
