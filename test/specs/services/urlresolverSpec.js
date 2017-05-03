(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    function setRemoteData($httpBackend) {
        $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
        $httpBackend.flush();
    }

    define(dependencies, function(AppBootstrap) {

        describe('URL resolver service', function() {

            var urlResolver, network, $httpBackend, $rootScope;

            beforeEach(module('app'));

            beforeEach(function() {
                module('utils.appUrlResolver', function($provide) {
                    $provide.constant('executeUrlResolverRunMethod', true);
                });
            });

            beforeEach(inject(function(_$httpBackend_, _$rootScope_) {

                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;

                inject(function(_appUrlResolver_) {
                    urlResolver = _appUrlResolver_;
                });
            }));

            it('should load app data when run block is called', function() {

                // GIVEN run block in URL resolver

                // WHEN run block is executed
                setRemoteData($httpBackend);

                // THEN application data should be loaded
                expect(urlResolver.appData.length).toEqual(AppTestResponses.metaApiResponse.length);
            });

            it('supports metaUrl', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the meta URL
                urlResolver.metaUrl('mediafolder').then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder/meta');
                });


                // WHEN resolving the invalid meta URL
                urlResolver.metaUrl('mediafolder2').then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Unable to resolve "rest-api-model-meta" API for model mediafolder2');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });

            it('supports actionsUrl', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the action URL
                urlResolver.actionUrl('mediafolder', 'create').then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder/actions/create');
                    expect(dataObj.hasOwnProperty('data')).toBeTruthy();
                });

                // WHEN resolving the invalid action URL
                urlResolver.actionUrl('mediafolder', 'create2').then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Action create2 not supported for mediafolder');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });

            it('supports actionsUrl for model item', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the action URL
                urlResolver.actionUrl('mediafolder', 'edit', 1).then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder/1/actions/edit');
                    expect(dataObj.hasOwnProperty('data')).toBeTruthy();
                });

                // WHEN resolving the invalid action URL
                urlResolver.actionUrl('mediafolder', 'edit', 1).then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Action edit not supported for mediafolder');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });

            it('supports listingUrl', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the listing URL
                urlResolver.listingUrl('mediafolder').then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder');
                });

                // WHEN resolving the invalid listing URL
                urlResolver.listingUrl('mediafolder3').then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Unable to resolve "rest-api" API for model mediafolder3');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });

            it('supports detailsUrl', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the details URL
                urlResolver.detailsUrl('mediafolder', 1).then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder/1');
                });

                // WHEN resolving the invalid details URL
                urlResolver.detailsUrl('mediafolder3', 0).then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Unable to resolve "rest-api-model-id" API for model mediafolder3');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });

            it('supports historyUrl', function() {
                // GIVEN application data
                setRemoteData($httpBackend);

                // WHEN resolving the change history URL
                urlResolver.historyUrl('mediafolder', 1).then(function(dataObj) {

                    // THEN it should succeed
                    expect(dataObj.url).toEqual('/api/generic/media/mediafolder/1/history');
                });

                // WHEN resolving the invalid change history URL
                urlResolver.historyUrl('mediafolder3', 0).then(null, function(msg) {

                    // THEN it should fail
                    expect(msg).toEqual('Unable to resolve "rest-api-model-id-history" API for model mediafolder3');
                });

                // Deferred object must be resolved here
                $rootScope.$apply();
            });
        });

        describe('loadData() in URL resolver', function() {

            var urlResolver, network, $httpBackend, $rootScope;

            beforeEach(module('app'));

            beforeEach(inject(function(_network_, _$httpBackend_, _$rootScope_) {

                network = _network_;
                spyOn(network, 'get').and.callThrough();

                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;

                inject(function(_appUrlResolver_) {
                    urlResolver = _appUrlResolver_;
                });
            }));

            it('should report error when failing', function() {
                var success, failure, resp;

                // GIVEN failure when fetching application model data
                $httpBackend.whenGET('/api/generic').respond(400, 'Error');

                // WHEN loading application data
                urlResolver.loadData().then(function(data) {
                    success = true;
                }, function(response) {
                    failure = true;
                    resp = response;
                });
                $httpBackend.flush();

                // THEN it should fail
                expect(failure).toBeTruthy();
                expect(success).toBeFalsy();
                expect(resp.data).toEqual('Error');
            });

            it('should load data only once', function() {

                // GIVEN application data in remote server
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                // WHEN loading application data
                var success;
                urlResolver.loadData().then(function() {
                    success = true;
                });
                $httpBackend.flush();

                // THEN it should succeed
                expect(success).toBeTruthy();
                expect(network.get.calls.count()).toEqual(1);

                // ----------

                // WHEN loading data again
                urlResolver.loadData().then(function(data) {

                    // THEN data is same as original response
                    expect(data.length).toEqual(AppTestResponses.metaApiResponse.length);

                    // AND no additional network call was made
                    expect(network.get.calls.count()).toEqual(1);
                });
            });
        });
    });

})(define, describe);
