(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    var audioPlayerResponse = [
        {
            "name": "Bryan_Adams_-_Xmas_Time.mp3",
            "url": "/api/generic/media/upload/64/actions/download",
            "id": 64
        },
        {
            "name": "Heart_Alone.mp3",
            "url": "/api/generic/media/upload/65/actions/download",
            "id": 65
        }
    ];

    var audioAllQuery = '/api/generic/media/upload?fields=id,name,url&call=audio&mediaplayer=flash';
    var audioNameQuery = audioAllQuery + '&by_name=bryan';
    var audioArtistQuery = audioAllQuery + '&by_artist=bryan';

    function initialize(audioQuery) {
        spyOn(this.$scope.options, 'audioLoader').and.callThrough();
        this.$httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
        this.$httpBackend.whenGET(audioQuery).respond(200, audioPlayerResponse);
    }

    function validate() {
        // THEN call the backend is made
        expect(this.$scope.options.audioLoader).toHaveBeenCalled();

        // AND UI elements are hidden
        expect(this.$scope.options.audioLoader.calls.count()).toEqual(1);
        expect(this.$scope.show).toBeFalsy();
        expect(this.$scope.showSongSelection).toBeFalsy();
    }

    function allMusicTest(audioQuery) {
        initialize.call(this, audioQuery);

        // GIVEN song selection menu
        var actionElement = this.$element.find('ul > li > a');

        // WHEN first selection item is clicked
        $(actionElement[0]).click();
        this.$httpBackend.flush();
        this.$scope.$digest();

        // THEN it should succeed
        validate.call(this);
    }

    function inputSearchTest(menuIndex) {
        // GIVEN song selection menu
        var actionElement = this.$element.find('ul > li > a');

        // WHEN selection item is clicked
        $(actionElement[menuIndex]).click();
        this.$scope.$digest();

        // AND some text is typed to search box
        var input = this.$element.find('input');
        input.val('bryan');
        input.trigger('input');
        this.$timeout.flush();
        this.$httpBackend.flush();

        // THEN it should succeed
        validate.call(this);
    }

    define(dependencies, function(AppBootstrap) {

        describe('FlashAudioPlayer directive', function() {

            var html = '<flash-audio-player model="upload"></flash-audio-player>';

            var ctrlObj, clipIndex;

            var flashPlayerObj = {
                initPlayer: function(_ctrlObj_) {
                    ctrlObj = _ctrlObj_;
                    return this;
                },
                playClipIndex: function(index) {
                    clipIndex = index;
                }
            };

            var playerlib = {
                $$name: 'playerlib',
                createFlashPlayer: function() {
                    return flashPlayerObj;
                }
            };

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                $('body').append('<a href="#" id="player"></a>');
            }, null, null, function() {
                module(function($provide) {
                    $provide.value('playerlib', playerlib);
                });
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('menu-dropdown li').length).toEqual(3);
                expect(this.$element.find('.audio-player').length).toEqual(1);
            });

            it('all my music is loaded', function() {
                allMusicTest.call(this, audioAllQuery);
            });

            it('music is loaded based on song name', function() {
                initialize.call(this, audioNameQuery);
                inputSearchTest.call(this, 1);
            });

            it('music is loaded based on artist name', function() {
                initialize.call(this, audioArtistQuery);
                inputSearchTest.call(this, 2);
            });

            it('user changes song from playlist', function() {

                // GIVEN user has made initial music selection
                allMusicTest.call(this, audioAllQuery);
                expect(this.$element.find('menu-dropdown').hasClass('ng-hide')).toBeTruthy();

                // WHEN player starts playing first song from playlist
                var scope = this.$element.find('audio-player').isolateScope();
                ctrlObj.onStart(scope.playlist[0]);

                // THEN current song should be visible for user
                var songTitle = 'Now playing: ' + scope.playlist[0].clipData.name;
                expect(this.$element.find('audio-player .audio-song-title').html()).toEqual(songTitle);

                // -----

                // WHEN song display element is clicked
                var songDisplayElement = this.$element.find('audio-player .audio-song-title');
                songDisplayElement.click();
                this.$scope.$digest();

                // THEN popup should contain selection list
                var el = AppTestUtils.selector.getSelector(this.$element);
                expect(el.length).toEqual(1);

                // -----

                // WHEN opening selection list
                AppTestUtils.selector.openDropdown(el, this.$scope);

                // THEN items are present in the list
                var choicesEls = AppTestUtils.selector.getSelectionItems(this.$element);
                expect(choicesEls.length).toEqual(2);

                // -----

                // WHEN selecting item from list
                var itemValue = 'Heart_Alone.mp3';
                AppTestUtils.selector.clickItem(el, itemValue, this.$scope);
                this.$timeout.flush();

                // THEN it get selected as current playlist song
                expect(clipIndex).toEqual(1);

                // -----

                // WHEN clicking the song selection menu in the popup element
                var toggleElement = this.$element.find('.playlist-popup-selection');
                toggleElement.click();
                this.$scope.$digest();

                // THEN menu should become visible
                expect(this.$element.find('menu-dropdown').hasClass('ng-hide')).toBeFalsy();

                // -----

                // WHEN clicking again the song selection menu in the popup element
                toggleElement.click();
                this.$scope.$digest();

                // THEN menu should become hidden
                expect(this.$element.find('menu-dropdown').hasClass('ng-hide')).toBeTruthy();
            });
        });
    });

})(define, describe);
