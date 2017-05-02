(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        describe('Register directive', function() {

            AppTestUtils.appTestSetup.call(this, '<dng-register></dng-register>', function() {
                spyOn(this.$state, 'go').and.callThrough();
            }, null, null, null);

            it('initializes correctly', function() {
                expect(this.$element.find('input').length).toEqual(3);
            });

            it('account is created', function() {
                this.$httpBackend.whenPOST('/api/auth/register').respond(200, 'Check your email');

                // GIVEN account information is added by user
                var input = this.$element.find('input');
                ng.element(input[0]).val('test');
                ng.element(input[1]).val('test@test.com');
                ng.element(input[2]).val('password');
                input.trigger('input');

                // WHEN create button is clicked
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);
                this.$httpBackend.flush();

                // THEN user is redirected to login page
                expect(this.$state.go).toHaveBeenCalledWith('auth.login');

                // AND success message is shown to user
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toEqual('Check your email');
            });
        });

        describe('AccountActivate directive', function() {

            AppTestUtils.appTestSetup.call(this, '<dng-account-activate></dng-account-activate>', function() {
                this.$state.params.activationkey = '123abc';
                spyOn(this.$state, 'go').and.callThrough();
            }, function($httpBackend) {
                $httpBackend.whenPOST('/api/auth/activate').respond(200, '');
            }, null, null);

            it('account is activated', function() {

                // GIVEN account activation key
                // WHEN account is activated

                // THEN user is redirected to login page
                expect(this.$state.go).toHaveBeenCalledWith('auth.login');

                // AND success message is shown to user
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toEqual('Your account is now activated');
            });
        });

        describe('ExtAuthActivation directive', function() {

            var html = '<dng-ext-auth-activation></dng-ext-auth-activation>';

            AppTestUtils.appTestSetup.call(this, html, function() {
                this.$state.params.provider = 'google';
            }, function($httpBackend) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
                $httpBackend.whenGET('/api/auth/user-details').respond(200, {id: 212});
            }, null, null);

            it('3rd party authentication is completed', function() {

                // GIVEN 3rd party authentication has been initialized by user
                // WHEN backend calls 3rd party authentication completion view

                // THEN success message should be shown to user
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toEqual('You are now signed-in');

                // AND user is authenticated
                expect(this.$rootScope.user.isAuthenticated()).toBeTruthy();
            });
        });
    });

})(define, describe);
