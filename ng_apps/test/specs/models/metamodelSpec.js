define([
    'utils/models/metamodel'
], function(MetaDataModel) {

    describe('MetaDataModel', function() {

        it('works with text input', function() {

            // GIVEN metadata
            var metadata = {
                name: {
                    type: 'text'
                }
            };

            // WHEN creating model from metadata
            var obj = new MetaDataModel({metadata: metadata});

            // THEN it should generate valid model instance
            expect(obj.$order.length).toEqual(1);
            expect(obj.$types).toEqual({
                name: {
                    type: 'text',
                    label: 'Name',
                    help: null,
                    editable: true,
                    directives: []
                }
            });
            expect(obj.name).toEqual(null);
        });

        it('supports setPostUrl', function() {
            var url = '/api';
            var obj = new MetaDataModel();
            obj.setPostUrl(url);
            expect(obj.$postUrl).toEqual(url);
            expect(obj.reset('name')).toBeFalsy();
        });

        it('supports setModelMeta', function() {
            var data = {
                name: 'test'
            };
            var obj = new MetaDataModel({metadata: {name: {}}});
            obj.setModelData(data);
            for (var key in obj.options.metadata) {
                expect(data[key]).toEqual(obj[key]);
            }
        });

        it('directives are initialized correctly', function() {
            // GIVEN metadata
            var metadata = {
                "name": {
                    "attributes": {
                        "min_length": 1,
                        "max_length": 256
                    },
                    "required": true,
                    "type": "text",
                    "help": "Name of upload"
                }
            };

            // WHEN creating model from metadata
            var obj = new MetaDataModel({metadata: metadata});

            // THEN input type definition is correct
            expect(obj.$types['name'].directives)
                .toEqual(['required', {type: 'maxlength', length: 256}, {type: 'minlength', length: 1}]);
        });
    });
});
