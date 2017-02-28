define([
    'underscore',
    'angular',
    './base',
    './directives',
    './validators',
    'text!./templates/custom-error.html',
    'common/utils'
], function (_, ng, BaseInput, InputDirectives, InputValidators, CustomErrorTemplate, UtilsLib) {
    "use strict";

    // http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
    // Adapted so that input items can also be objects
    function uniqueFast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(ng.isObject(item)) {
                item = item.type;
            }

            if(seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = a[i];
            }
        }
        return out;
    }

    /**
     * Base class for form inputs. Each input must be based on this class.
     * At minimum the input must provide implementation for the _toHTML()
     * method.
     */
    var BaseFormInput = BaseInput.extend({
        /*
         * Tag for input directives. This will be replaced with validator directives
         * if specified for the input.
         *
         * There should be no need to change this.
         */
        directiveTag: 'directives',

        // CSS classes for the input
        inputClasses: 'form-control',

        // Custom error template
        errorTemplate: CustomErrorTemplate,

        // Input template, can also be a function
        template: '',

        // Template tags
        templateFormTag: '[[formRef]]',
        templateNameTag: '[[nameRef]]',
        templateModelTag: '[[modelRef]]',
        templateDirectiveTag: '[[directiveRef]]',

        // Reset value for the field
        fieldReset: null,

        // Default tuning settings how model updates are done
        modelOptions: {},

        /**
         * Set up options for the input.
         *
         * @param {Object} options Input options.
         */
        _initOptions: function(options) {
            this.options = ng.extend({}, options);

            if (!this.options.directives) {
                this.options.directives = [];
            }

            // Include default validators
            if (this.options.validators) {
                this.options.validators = this.options.validators.concat(this._defaultValidators());
            }
            else {
                this.options = ng.extend(this.options, {validators: this._defaultValidators()});
            }

            // Include validators from directives
            ng.forEach(this.options.directives, function(directive) {
                this.push(directive);
            }, this.options.validators);

            // Make sure that each validator is included only once.
            this.options.validators = uniqueFast(this.options.validators);

            this.$scope = this.options.$scope;
        },

        /**
         * return NgModelOptions for input.
         */
        getNgModelOptions: function() {
            return ng.extend((this.options.modelOptions || {}), this.modelOptions);
        },

        /**
         * Each subclass can provide implementation for this method. By default
         * the input HTML template is returned, if present.
         *
         * @returns {String} HTML for the input.
         */
        _toHTML: function() {
            return this._templateHTML();
        },

        /**
         * Return HTML using input template, if any.
         *
         * @returns {String} HTML for the input.
         */
        _templateHTML: function() {
            var html = '';
            if (this.template) {
                html = (_.isFunction(this.template)) ? this.template() : this.template;
                html = UtilsLib.Strings.replaceAll(html, this.templateNameTag, this.options.name);
                html = UtilsLib.Strings.replaceAll(html, this.templateFormTag, this.options.formName);
                html = UtilsLib.Strings.replaceAll(html, this.templateModelTag, this.modelRef());
                html = UtilsLib.Strings.replaceAll(html, this.templateDirectiveTag, this.directiveTag + '=""');
            }

            return html;
        },

        /**
         * Default validators for the input.
         *
         * @returns {List} List of validator names.
         */
        _defaultValidators: function() {
            return [];
        },

        /**
         * Reset input field value.
         *
         * @param {Object} model Model object.
         * @param {String} field Model field name.
         */
        resetValue: function(model, field) {
            if (this.fieldReset !== undefined) {
                Object.setModelFieldValue(model, field, this.fieldReset || null);
            }
        },

        /**
         * Set form as invalid.
         *
         * @param {Object} $scope Scope object.
         */
        setInvalid: function($scope) {
            var formObj = this.formObj($scope);
            formObj.$invalid = true;
        },

        /**
         * Return the input's parent form object.
         */
        formObj: function($scope) {
            return $scope.$eval(this.form());
        },

        /**
         * Return the input's form object.
         */
        formObjInput: function($scope) {
            var obj = $scope.$eval(this.options.formName);
            if (!obj) {
                obj = $scope.$eval(this.form());
            }

            return obj[this.options.name];
        },

        /**
         * Set input form as dirty.
         */
        setDirty: function($scope) {
            var formObj = this.formObjInput($scope);
            formObj.$setDirty();
        },

        onChange: function($scope) {
            // Another input contains dependency to this input.
            // Trigger the validation of the reference input.
            if ($scope.options.validateRef) {
                var form = $scope.$eval(this.form());
                var formObj = form[$scope.options.validateRef];

                // The reference input must be present also
                if (formObj) {
                    formObj.$validate();
                }
            }
        },

        /**
         * Return the final HTML template for the input.
         */
        toHTML: function($scope) {
            // Input validation(s)
            var html = new InputValidators(this.options).toHTML($scope, this.formRef());

            // Custom validations
            html += this.errorTemplate;

            // Input template
            html += this._toHTML();

            // Input directives, if any
            var directives = new InputDirectives(this.options).toHTML($scope);
            return html.replace(this.directiveTag + '=""', directives);
        },

        /**
         * Custom error handling for the input.
         *
         * @param {Object} $scope Scope object.
         * @returns {List} List of error messages.
         */
        _customErrors: function($scope) {
            return [];
        },

        /**
         * Type specific input controller. Subclass should provide implementation
         * for this method.
         *
         * @param {Object} $scope Scope object.
         */
        controller: function($scope) {
        },

        /**
         * Input controller.
         *
         * @param {Object} $scope Scope object.
         */
        inputController: function($scope) {
            var self = this;

            $scope.customErrors = function() {
                var errors = self._customErrors($scope);
                if (errors.length > 0) {
                    // If errors found, set form as invalid
                    self.setInvalid($scope);
                }

                return errors;
            };

            $scope.$form = this.options.$form;

            this.controller($scope);
        }
    });

    return BaseFormInput;
});
