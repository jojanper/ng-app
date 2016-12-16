(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('imagelib factory', function() {

            AppTestUtils.appTestSetup.call(this);

            var imagelib, $scope;

            beforeEach(function() {

                inject(function(_imagelib_, $rootScope) {
                    imagelib = _imagelib_;
                    $scope = $rootScope.$new();
                });
            });

            it('readAsDataUrl', function(done) {

                // GIVEN file
                var file = new Blob(['test'], {type: 'image/jpeg'});

                // WHEN reading file data for data URL
                var success = false;
                imagelib.readAsDataUrl(file, $scope).then(function(dataUrl) {
                    success = true;
                });

                setTimeout(function() {
                    // THEN it should succeed
                    expect(success).toBeTruthy();
                    done();
                }, 400);
            });

            it('loadImage', function(done) {

                // GIVEN image URL
                var file = "/static/img/icons/music.png";

                // WHEN reading image
                var success = false;
                imagelib.loadImage(file, $scope).then(function() {
                    success = true;
                });

                setTimeout(function() {
                    // THEN it should succeed
                    expect(success).toBeTruthy();
                    done();
                }, 400);
            });
        });
    });

})(define, describe);
