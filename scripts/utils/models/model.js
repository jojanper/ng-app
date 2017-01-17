/**
 * Base model definition.
 */
define([
    'angular',
    'common/toolbox',
    'common/utils'
], function (ng, Toolbox, UtilsLib) {
    "use strict";

    var BaseModel = Toolbox.BaseClass.extend({
        constructor: function(options) {

            this.$name = null;
            this.$types = {};
            this.$order = [];
            this.$inputDefs = [];
            this.$model = null;
            this.options = options || {};

            this.setInitData();
            this.initialize();
            this._setOptionsInputDefs();
            this._setInputDefs();
        },

        setInitData: function() {
        },

        initialize: function() {
            if (this.options && this.options.data) {
                for (var key in this.options.data) {
                    if (key) {
                        this[key] = this.options.data[key];
                    }
                }
            }
        },

        /**
         * Set input field definitions based on model's $order and $types properties.
         *
         * @param {Array} $order Input field names.
         * @param {Object} $types Input field definitions as key-value pairs.
         * @param {string} dotPrefix Prefix for input field name. This is set for all input fields that are part of object type.
         */
        _setInputDefsIterator: function($order, $types, dotPrefix) {
            for (var i = 0; i < $order.length; i++) {
                var name = $order[i];

                if ($types[name].type === 'object') {
                    // All input field names that belong to this must be prefixed
                    var prefix = dotPrefix + name + '.';

                    // Iterate the input fields within the object type
                    this._setInputDefsIterator($types[name].$order, $types[name].$types, prefix);
                }
                else {
                    var ref = dotPrefix + name;

                    this.$inputDefs.push(ng.extend({
                        name: ref
                    }, $types[name]));
                }
            }
        },

        _setInputDefs: function() {
            this.$inputDefs = [];
            this._setInputDefsIterator(this.$order, this.$types, '');
        },

        _setOptionsInputDefs: function() {
            if (this.options && this.options.inputDefs) {
                for (var i = 0; i < this.options.inputDefs.length; i++) {
                    this.$types[this.options.inputDefs[i].name] = this.options.inputDefs[i];
                    this.$order.push(this.options.inputDefs[i].name);
                }
            }
        },

        reset: function(field) {
            return false;
        },

        modelMatch: function(model) {
            return this.$model === model;
        },

        setSelectorList: function(item, selectorList) {
            if (this.$types[item] && this.$types[item].type === 'selector') {
                if (!this.$types[item].selector) {
                    this.$types[item].selector = {};
                }
                this.$types[item].selector.selectorList = selectorList;

                return true;
            }

            return false;
        },

        getValue: function(field) {

            // Data field is object and has ID
            if (ng.isObject(this[field]) && this[field].id) {
                return (this.$types[field] && this.$types[field].type === 'object') ? this[field] : this[field].id;
            }

            // Data field is array and each item must have ID
            else if (ng.isArray(this[field])) {
                var items = [];
                for (var i = 0; i < this[field].length; i++) {
                    items.push(this[field][i].id);
                }
                return items;
            }

            return this[field];
        },

        getInputs: function() {
            var inputs = [];
            ng.forEach(this.$inputDefs, function(value, key) {
                this.push(value);
            }, inputs);

            return inputs;
        },

        getFieldOptions: function(field) {
            if (this.$types.hasOwnProperty(field)) {
                return this.$types[field];
            }

            // Alternative reference if default field not accessible, related to the use of object input types
            var altRef = UtilsLib.Strings.replaceAll(field, '.', '.$types.');
            return Object.resolveKey(this.$types, altRef);
        },

        /**
         * Reset field item from model.
         *
         * @param {String} fieldName Field name
         * @param {Object} $scope Scope object
         * @param {Class} FieldResetCls Field reset implementation in case model does not support the field reset.
         */
        formReset: function(fieldName, $scope, FieldResetCls) {
            var data = ng.extend({
                name: fieldName,
                formName: $scope.name
            }, this.getFieldOptions(fieldName));

            if (data.editable !== false) {
                // If model does not support input field reset, then use the form specific reset
                if (!this.reset(data.name)) {
                    new FieldResetCls($scope, data).resetValue(this, data.name);
                }
            }
        }
    });

    return BaseModel;
});
