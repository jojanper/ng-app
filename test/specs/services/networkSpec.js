(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'angular'
    ];

    define(dependencies, function(AppBootstrap, angular) {

        var appName = 'app';

        describe('Network service', function() {

            beforeEach(module(appName));

            var networkService, $httpBackend, appMessagesService, $window, $rootScope,
                dngUserManagement, $state;

            beforeEach(function() {
                $window = {
                    location: {
                        reload: jasmine.createSpy()
                    },
                    angular: angular
                };

                module(function($provide) {
                    $provide.value('$window', $window);
                });

                AppTestUtils.login();

                inject(function(_network_, _$httpBackend_, _appMessagesService_, _$rootScope_,
                    _dngUserManagement_, _$state_) {
                    networkService = _network_;
                    $httpBackend = _$httpBackend_;
                    appMessagesService = _appMessagesService_;
                    $rootScope = _$rootScope_;
                    dngUserManagement = _dngUserManagement_;
                    $state = _$state_;
                });
            });

            afterEach(function() {
                var messages = appMessagesService.getMessages();
                for (var i = 0; i < messages.length; i++) {
                    appMessagesService.removeMessage(0);
                }
            });

            it('works with GET', function() {
                var success, api = '/api/get';

                $httpBackend.whenGET(api).respond(200);

                networkService.get(api).then(function() {
                    success = true;
                });

                $httpBackend.flush();

                expect(success).toBeTruthy();
            });

            it('works with POST', function() {
                var success, api = '/api/post';

                $httpBackend.whenPOST(api).respond(200);

                networkService.post(api).then(function() {
                    success = true;
                });

                $httpBackend.flush();

                expect(success).toBeTruthy();
            });

            it('works with PUT', function() {
                var success, api = '/api/put';

                $httpBackend.whenPUT(api).respond(200);

                networkService.put(api).then(function() {
                    success = true;
                });

                $httpBackend.flush();

                expect(success).toBeTruthy();
            });

            it('works with PATCH', function() {
                var success = false, api = '/api/patch';

                $httpBackend.whenPATCH(api).respond(200);

                networkService.patch(api).then(function() {
                    success = true;
                });

                $httpBackend.flush();

                expect(success).toBeTruthy();
            });

            it('works with DELETE', function() {
                var success, api = '/api/delete';

                $httpBackend.whenDELETE(api).respond(200);

                networkService.delete(api).then(function() {
                    success = true;
                });

                $httpBackend.flush();

                expect(success).toBeTruthy();
            });

            it('remote connection fails', function() {
                var success = false, api = '/api/post';

                $httpBackend.whenPOST(api).respond(400, {'errors': ['Error']});

                networkService.post(api).then(function() {
                    success = true;
                }).catch(function() {});

                $httpBackend.flush();

                expect(success).toBeFalsy();

                $httpBackend.whenPUT(api).respond(400, {'errors': ['Error2']});

                var failure = false;
                networkService.put(api).then(function() {
                }, function() {
                    failure = true;
                });

                $httpBackend.flush();

                expect(failure).toBeTruthy();

                $httpBackend.whenGET(api).respond(400, 'Error');

                failure = false;
                networkService.get(api).then(function() {
                }, function() {
                    failure = true;
                });

                $httpBackend.flush();

                expect(failure).toBeTruthy();
                expect(appMessagesService.getMessages().length).toEqual(3);
            });

            it('should handle detail error message', function() {
                var success = false, api = '/api/post/test';

                $httpBackend.whenPOST(api).respond(400, {'detail': 'Detail error message'});

                networkService.post(api).then(function() {
                    success = true;
                }).catch(function() {});

                $httpBackend.flush();

                expect(success).toBeFalsy();
                var messages = appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toContain('<div>Detail error message</div>');
            });

            it('should handle multiple error messages', function() {
                var success = false, api = '/api/post/test';

                $httpBackend.whenPOST(api).respond(400, {'errors': ['Error1', 'Error2']});

                networkService.post(api).then(function() {
                    success = true;
                }).catch(function() {});

                $httpBackend.flush();

                expect(success).toBeFalsy();
                var messages = appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toContain('<br/>');
            });

            it('makes full reload if application code at server has changed', function() {

                // GIVEN application code has changed at server side
                var api = '/api/get';
                $httpBackend.whenGET(api).respond(418, 'Application code has changed. Please reload.');

                // WHEN fetching some data from server
                networkService.get(api).catch(function() {});
                $httpBackend.flush();

                // THEN full reload is performed at client side
                expect($window.location.reload).toHaveBeenCalled();
            });

            it('redirects to login page on HTTP 401', function() {

                // GIVEN 401 response code from server
                var api = '/api/get';
                spyOn(dngUserManagement, 'reset').and.callThrough();
                spyOn($state, 'go').and.callThrough();
                $httpBackend.whenGET(api).respond(401, '');

                // WHEN fetching some data from server
                networkService.get(api).catch(function() {});
                $httpBackend.flush();

                // THEN user status is reset and user redirected to login page
                expect(dngUserManagement.reset).toHaveBeenCalled();
                expect(dngUserManagement.user.isAuthenticated()).toBeFalsy();
                expect($state.go).toHaveBeenCalledWith('auth.login');
            });
        });
    });

})(define, describe);
