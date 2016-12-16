(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'common/utils'
    ];

    define(dependencies, function(AppBootstrap, UtilsLib) {

        var appName = 'app';

        describe('draalBgImage directive', function() {

            beforeEach(module(appName));

            var $rootScope, $scope, $element;
            var imgUrl = '/static/img/icons/music.png';

            var imagelib = {
                $$name: 'imagelib',
                loadImage: function(url, $scope) {
                    return {
                        then: function(fn) {
                            fn();
                        }
                    };
                }
            };

            beforeEach(function() {

                module(function($provide) {
                    $provide.value('imagelib', imagelib);
                });

                inject(function(_$rootScope_, $compile) {
                    // Instantiate directive.
                    var html = '<div draal-bg-image="' + imgUrl + '"></div>';
                    var obj = AppTestUtils.ngCreateElement(_$rootScope_, $compile, html);

                    $scope = obj.$scope;
                    $element = obj.$element;
                    $rootScope = _$rootScope_;
                });

            });

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                // GIVEN backround image
                // WHEN image is loaded to element
                $rootScope.$digest();

                var target = $element.prop('style')['backgroundImage'];
                target = UtilsLib.Strings.replaceAll(target, 'url(', '');
                target = UtilsLib.Strings.replaceAll(target, ')', '');
                target = UtilsLib.Strings.replaceAll(target, '"', '');
                expect(target).toContain(imgUrl);
            });
        });
    });

})(define, describe);
