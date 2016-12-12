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

            var img = '/static/img/icons/music.png';

            var $rootScope, $scope, $element;

            beforeEach(inject(function(_$rootScope_, $compile) {
                // Instantiate directive.
                var html = '<div draal-bg-image="' + img + '"></div>';
                var obj = AppTestUtils.ngCreateElement(_$rootScope_, $compile, html);
                $scope = obj.$scope;
                $element = obj.$element;
                $rootScope = _$rootScope_;
            }));

            it('initializes correctly', function(done) {
                // GIVEN backround image
                // WHEN image is loaded to element
                $rootScope.$apply();

                setTimeout(function() {
                    // THEN element should have background image
                    var target = $element.prop('style')['backgroundImage'];
                    target = UtilsLib.Strings.replaceAll(target, 'url(', '');
                    target = UtilsLib.Strings.replaceAll(target, ')', '');
                    target = UtilsLib.Strings.replaceAll(target, '"', '');
                    expect(target).toContain(img);
                    done();
                }, 800);
            });
        });
    });

})(define, describe);
