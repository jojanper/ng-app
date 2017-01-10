/**
 * Test model definition.
 */
define([
    'angular',
    'utils/models/model'
], function (ng, BaseModel) {
    "use strict";

    var TestModel = BaseModel.extend({

        setInitData: function() {
            this.name = 'jojan';
            this.middlename = 'Mick';
            this.email = 'jojanper@gmail.com';
            this.data = {
                id: 'customer',
                description: "Customer"
            };
            this.multiData = [
                {
                    id: 'region',
                    description: "Region",
                    hide: true
                },
                {
                    id: 'country',
                    description: "Country",
                    hide: true
                }
            ];

            this.objectData = {
                name: 'toimiiko'
            };

            this.$types = {
                name: {
                    type: "text",
                    label: "Your Name",
                    directives: ['required',
                                 {type: 'maxlength', length: 5},
                                 {type: 'minlength', length: 3},
                                 {type: 'pattern', pattern: "/^[0-9-a-z]{1,7}$/"}]
                },
                middlename: {
                    type: "text",
                    label: "Your Middle Name",
                    editable: false
                },
                email: {
                    type: "email",
                    label: "Your E-mail address",
                    directives: ['required', {type: 'blacklist', items: ['name@gmail.com', 'item@gmail.com']}]
                },
                data: {
                    type: "selector",
                    label: "Selections",
                    directives: ['required'],
                    placeholder: 'Select data...',
                    selector: {
                        displayKey: 'description'
                    },
                    onChange: function() {
                        console.log('change');
                    }
                },
                multiData: {
                    type: "multiSelector",
                    label: "Multi Selections",
                    directives: ['required'],
                    placeholder: 'Multi select data...',
                    selector: {
                        displayKey: 'description',
                        selectorRef: 'data',
                        minItems: 2,
                        maxItems: 4
                    }
                },

                objectData: {
                    type: 'object',
                    noInputLabel: true,
                    $order: ['name', 'name2'],
                    $types: {
                        name: {
                            type: "text",
                            label: "Your Object Name",
                            directives: ['required',
                                         {type: 'maxlength', length: 5},
                                         {type: 'minlength', length: 3},
                                         {type: 'pattern', pattern: "/^[0-9-a-z]{1,7}$/"}]
                        },
                        name2: {
                            type: "text",
                            label: "Your Object Name2",
                            directives: ['required',
                                         {type: 'maxlength', length: 5},
                                         {type: 'minlength', length: 3},
                                         {type: 'pattern', pattern: "/^[0-9-a-z]{1,7}$/"}]
                        }
                    }
                }
            };

            this.$order = ['name', 'middlename', 'data', 'email', 'multiData', 'objectData'];
        },

        reset: function(field) {
            if (this[field] && field === 'name') {
                this[field] = null;
                return true;
            }

            return false;
        }
    });

    return TestModel;
});
