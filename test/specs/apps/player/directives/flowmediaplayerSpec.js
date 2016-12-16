(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    var videoPlayerListUrl = '/api/generic/media/upload?fields=id,type,url&call=video&mediaplayer=flow';

    define(dependencies, function(AppBootstrap) {

        describe('FlowMediaPlayer directive', function() {

            var html = '<flow-media-player model="upload"></flow-media-player>';

            var medialoadUrl = '/api/generic/media/upload?draw=1&columns%5B0%5D%5Bdata%5D=function&columns' +
                    '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true' +
                    '&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&order' +
                    '%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search%5Bvalue%5D=&search' +
                    '%5Bregex%5D=false';

            var ctrlObj;

            var flowPlayerObj = {
                initPlayer: function(_ctrlObj_) {
                    ctrlObj = _ctrlObj_;
                    return this;
                },
                getPlayer: function() {
                    return {
                        play: function() {}
                    };
                }
            };

            var playerlib = {
                $$name: 'playerlib',
                createFlowPlayer: function() {
                    return flowPlayerObj;
                }
            };

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
            }, function($httpBackend) {
                // Data for table
                $httpBackend.whenGET(medialoadUrl).respond(200, AppTestResponses.modelListingsResponse.mediaplayer);

                // Data for media player
                $httpBackend.whenGET(videoPlayerListUrl).respond(200, AppTestResponses.modelListingsResponse.videoplayer);

                // Data for URL resolving
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

            }, null, function() {
                module(function($provide) {
                    $provide.value('playerlib', playerlib);
                });
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('.flowplayer').length).toEqual(1);
            });
        });
    });

})(define, describe);
