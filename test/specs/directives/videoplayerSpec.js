(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    var videoPlayerListUrl = '/api/generic/media/upload?fields=id,type,url&call=video&mediaplayer=flow';

    define(dependencies, function(AppBootstrap) {

        describe('VideoPlayer directive', function() {

            var html = '<video-player model="upload" options="options"></video-player>';

            AppTestUtils.appTestSetup.call(this, html, null, function($httpBackend) {
                // Data for URL resolving
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                $httpBackend.whenGET(videoPlayerListUrl).respond(200, AppTestResponses.modelListingsResponse.videoplayer);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('.video-player').length).toEqual(1);
            });
        });
    });

})(define, describe);
