(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('AudioPlayer directive', function() {

            var html = '<audio-player model="upload" options="options"></audio-player>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                $('body').append('<a href="#" id="player"></a>');
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('.audio-player').length).toEqual(1);
            });

            it('audio data is loaded to player', function() {
                // GIVEN audio player directive
                this.$httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
                this.$httpBackend.whenGET('/api/generic/media/upload?fields=id,name,url&call=audio&mediaplayer=flash')
                    .respond(200, AppTestResponses.modelListingsResponse.audioplayer);

                // WHEN audio is loaded to player
                this.$scope.options.audioLoader('');

                // THEN it should succeed
                this.$httpBackend.flush();
            });
        });
    });

})(define, describe);
