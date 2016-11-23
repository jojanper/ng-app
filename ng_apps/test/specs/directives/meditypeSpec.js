(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'common/html'
    ];

    define(dependencies, function(AppBootstrap, htmlLib) {

        var appName = 'app';

        describe('MediaType directive', function() {

            var $rootScope, $compile;

            beforeEach(module(appName));

            beforeEach(inject(function(_$rootScope_, _$compile_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
            }));

            it('renders media icons from string type', function() {
                var $scope;

                // GIVEN media types as strings
                var mediaTypes = ['audio', 'image', 'video'];

                for (var i = 0; i < mediaTypes.length; i++) {
                    var type = mediaTypes[i];

                    // WHEN directive is created
                    var element = htmlLib.media_type('', {
                        type: type
                    });
                    var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element);
                    $scope = obj.$scope;

                    // THEN correct element should be created
                    expect($(obj.$element.find('img')[0]).prop('title')).toContain('Media contains ' + type);

                    $scope.$destroy();
                }
            });

            it('renders media icons from integer type', function() {
                var $scope;

                // GIVEN media types as integers
                var mediaTypes = ['0', '1', '2'];

                for (var i = 0; i < mediaTypes.length; i++) {
                    var type = mediaTypes[i];

                    // WHEN directive is created
                    var element = htmlLib.media_type('', {
                        type: type
                    });
                    var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element);
                    $scope = obj.$scope;

                    // THEN correct element should be created
                    expect(obj.$element.find('img').length).toEqual(1);

                    $scope.$destroy();
                }
            });

            it('renders nothing for unknown type', function() {
                var element = htmlLib.media_type('', {
                    type: 'media'
                });
                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element);

                expect(obj.$element.find('img').length).toEqual(0);

                obj.$scope.$destroy();
            });
        });
    });

})(define, describe);
