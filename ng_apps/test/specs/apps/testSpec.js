(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        var appName = 'app';

        describe('TestController', function() {

            beforeEach(module(appName));

            var $scope;

            beforeEach(inject(function($rootScope, $controller) {
                $scope = $rootScope.$new();
                var ctrl = $controller('TestFormController', {
                    $scope: $scope
                });
                $scope.$digest();
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                expect($scope.openTemplateDialog).toEqual(jasmine.any(Function));
            });
        });
    });

})(define, describe);
