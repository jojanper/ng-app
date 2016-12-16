/**
 * Map model's meta data into UI model.
 */
define([
    'angular',
    'utils/models/model'
], function (ng, BaseModel) {
    "use strict";

    var MetaDataModel = BaseModel.extend({

        initialize: function() {
            if (this.options && this.options.metadata) {

                this.$name = this.options.name;
                this.$postUrl = this.options.postUrl;
                this.$model = this.options.model;

                this.$order = [];
                for (var key in this.options.metadata) {
                    if (key) {
                        var data = this.options.metadata[key];

                        this[key] = null;
                        this.$types[key] = {
                            // Data type (text, selector, etc)
                            type: data.type,

                            // Label for data item
                            label: data.label || key.capitalize1stLetter(),

                            // Hint text for item, if any
                            help: data.help || null,

                            // Editable status; false indicates that item is read only
                            editable: data.editable || true
                        };
                        ng.extend(this.$types[key], data);
                        this.$types[key].directives = this._setDirectives(data);
                        this.$order.push(key);
                    }
                }
                this._setInputDefs();
            }
        },

        setPostUrl: function(url) {
            this.$postUrl = url;
        },

        setModelData: function(modelData) {
            this.options.modelData = modelData;
            for (var key in this.options.metadata) {
                if (key) {
                    this[key] = modelData[key];
                }
            }

            this.id = modelData.id;
        },

        _setDirectives: function(data) {
            var directives = [];

            /*jshint camelcase: false */
            if (data.required) {
                directives.push('required');
            }

            if (data.attributes) {
                if (data.attributes.max_length) {
                    directives.push({type: 'maxlength', length: data.attributes.max_length});
                }

                if (data.attributes.min_length) {
                    directives.push({type: 'minlength', length: data.attributes.min_length});
                }
            }
            /*jshint camelcase: true */

            return directives;
        }
    });

    return MetaDataModel;
});
