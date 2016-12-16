(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        var appName = 'app';

        describe('TestTablesController', function() {

            var $scope, ctrl;

            beforeEach(module(appName));

            beforeEach(function() {

                inject(function($rootScope, $controller) {
                    $scope = $rootScope.$new();
                    ctrl = $controller('TestTablesController', {$scope: $scope});
                    $rootScope.$apply();
                });
            });

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                expect($scope.options).not.toEqual(null);
                expect($scope.options.rowDetails).not.toEqual(null);
                expect($scope.options.baseUrl).not.toEqual(null);
            });

            it('has table details callbacks', function() {
                expect($scope.options.rowDetails.length).toEqual(2);
                for (var i = 0; i < $scope.options.rowDetails.length; i++) {
                    expect($scope.options.rowDetails[i].detailsCallback).toEqual(jasmine.any(Function));
                    expect($scope.options.rowDetails[i].detailsCallback({name: 'name'}).length > 0).toBeTruthy();
                }
            });

            it('has table columns data', function() {
                expect($scope.options.columns.length).toEqual(3);

                var response = '<a ui_sref="playlists.edit({id:0})">test</a>';
                expect($scope.options.columns[1].render(null, null, {id: '0', name: 'test'})).toEqual(response);
            });
        });
    });

})(define, describe);
