define([
    'jquery',
    'utils/models/model'
], function($, BaseModel) {

    describe('BaseModel', function() {

        it('supports options.data', function() {

            // GIVEN options data
            var data = {
                a: 1,
                b: {
                    data: 2
                }
            };

            // WHEN creating model with options
            var model = new BaseModel({data: data});

            // THEN data should be available in the model
            expect(model.a).toEqual(data.a);
            expect(model.b).toEqual(data.b);
        });

        it('supports options.inputDefs', function() {

            // GIVEN inputDefs for options data
            var inputDefs = [
                {
                    name: 'data',
                    type: "selector",
                    label: "Selections",
                    directives: ['required'],
                    placeholder: 'Select data...'
                }
            ];

            // WHEN creating model with options
            var model = new BaseModel({inputDefs: inputDefs});

            // THEN model input definitions should be valid
            expect(model.$types[inputDefs[0].name]).toEqual(inputDefs[0]);
            expect(model.$inputDefs.length).toEqual(1);
            expect(model.$inputDefs[0].name).toEqual(inputDefs[0].name);

            // -----

            // WHEN setting selector list to data item that is not present
            var status = model.setSelectorList('data2', ['a']);

            // THEN it should fail
            expect(status).toBeFalsy();

            // -----

            // WHEN setting selector list
            status = model.setSelectorList('data', ['a']);

            // THEN it should succeed
            expect(status).toBeTruthy();

            // AND list has been set
            expect(model.$types.data.selector.selectorList).toEqual(['a']);
        });

        it('supports getInputs and getFieldOptions', function() {

            // GIVEN model definition
            var inputDefs = [
                {
                    name: 'objectData',
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
                            label: "Your Optional Object Name2"
                        }
                    }
                },
                {
                    name: 'data',
                    type: "selector",
                    label: "Selections",
                    directives: ['required'],
                    placeholder: 'Select data...'
                }
            ];
            var objData = {id: 55, name: 'abc', name2: 'efg'};
            var model = new BaseModel({data: {objectData: objData}, inputDefs: inputDefs});

            // WHEN fetching model inputs
            var inputs = model.getInputs();

            // THEN valid inputs should be present
            expect(inputs.length).toEqual(3);

            // AND input field ordering is correct
            var names = [];
            for (var i = 0; i < inputs.length; i++) {
                names.push(inputs[i].name);
            }
            expect(names).toEqual(['objectData.name', 'objectData.name2', 'data']);

            // -----

            // WHEN fetching field options
            var options = model.getFieldOptions('objectData.name2');

            // THEN correct options are retrieved
            expect(options).toEqual(inputDefs[0].$types.name2);

            // -----

            // WHEN fetching field value
            var value = model.getValue('objectData');

            // THEN it should succeed
            expect(value).toEqual(objData);
        });

        it('supports getValue for object', function() {

            // GIVEN model with simple data item
            var data = {a: 12};
            var model = new BaseModel({data: data});

            // WHEN fetching data item value
            var value = model.getValue('a');

            // THEN it should succeed
            expect(value).toEqual(data.a);

            // -----

            // GIVEN model with complex data item
            data = {a: {id: 123, name: 'test'}};
            model = new BaseModel({data: data});

            // WHEN fetching data item value
            value = model.getValue('a');

            // THEN it should succeed
            expect(value).toEqual(data.a.id);
        });

        it('supports getValue for array', function() {

            // GIVEN model with array data
            var data = {k: [{a: 12, id: 123}]};
            var model = new BaseModel({data: data});

            // WHEN fetching data item value
            var value = model.getValue('k');

            // THEN it should succeed
            expect(value.length).toEqual(1);
            expect(value[0]).toEqual(data.k[0].id);
        });

        it('supports formReset', function() {

            function mockResetCls($scope, data) {
                this.resetValue = function(model, fieldName) {
                    model[fieldName] = null;
                };
            }

            // GIVEN read only item in model definition
            var inputDefs = [
                {
                    name: 'data',
                    type: "text",
                    editable: false,
                    placeholder: 'Item name...'
                }
            ];
            var objData = {data: 'abc'};
            var model = new BaseModel({data: objData, inputDefs: inputDefs});

            // WHEN reseting the model field
            model.formReset('data', {name: 'form'}, mockResetCls);

            // THEN value should remain untouched
            expect(model.data).toEqual('abc');

            // -----

            // GIVEN editable field definition
            inputDefs[0].editable = true;

            // WHEN reseting the model field
            model = new BaseModel({data: objData, inputDefs: inputDefs});
            model.formReset('data', {name: 'form'}, mockResetCls);

            // THEN value should be changed
            expect(model.data).toEqual(null);
        });
    });
});
