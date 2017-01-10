define([
    'common/toolbox'
], function (Toolbox) {
    "use strict";

    var BaseInput = Toolbox.BaseClass.extend({
        constructor: function(options) {
            this.options = options;
            if (this._initOptions) {
                this._initOptions(options);
            }
            this.initialize();
        },

        initialize: function() {
        },

        /**
         * Determine form reference. Form reference is the location of the form object
         * with respect to the current scope in dot notation.
         *
         * @returns {String} Form reference within scope context.
         */
        form: function() {
            var ref = '$parent.';
            if (this.options.manualInput) {
                ref += '$parent.';
            }
            if (this.options.hasOwnProperty('autoObject')) {
                ref += '$parent.';
            }

            return ref + this.options.formName;
        },

        /**
         * Determine reference for the input within form object.
         *
         * @returns {String} Input reference within form object context.
         */
        formRef: function() {

            /*
             * Reference within object needs special care as the name (e.g., objectData.name) is used as such
             * in form controller where each input is published as a property into the scope using the name attribute
             * on the input control. The name attribute specifies the name of the property on the form instance.
             */
            if (this.options.name.isObjectInput()) {
                return this.form() + '["' + this.options.name + '"]';
            }

            return this.form() + '.' + this.options.name;
        },

        /**
         * Determine model reference for the input within scope's model object.
         *
         * @returns {String} Model reference.
         */
        modelRef: function() {
            return 'model.' + this.options.name;
        },

        setModelValue: function($scope, value, append) {
            Object.setModelFieldValue($scope.model, this.options.name, value, append);
        },

        getModelValue: function($scope) {
            return $scope.$eval(this.modelRef());
        }
    });

    return BaseInput;
});
