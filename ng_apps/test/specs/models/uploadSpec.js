define([
    'utils/models/upload'
], function(UploadModel) {

    describe('UploadModel', function() {

        it('supports multipleFiles property', function() {

            // GIVEN upload model with multiple files support
            var model = new UploadModel({multiple: true});

            // WHEN determining multiple files support status
            var status = model.multipleFiles();

            // THEN it should succeed
            expect(status).toBeTruthy();

            // -----

            // GIVEN upload model without multiple files support
            model = new UploadModel();

            // WHEN determining multiple files support status
            status = model.multipleFiles();

            // THEN it should fail
            expect(status).toBeFalsy();
        });
    });
});
