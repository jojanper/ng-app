(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        var html = '<app-header></app-header>';

        describe('AppHeader directive', function() {

            // GIVEN unauthenticated user
            AppTestUtils.appTestSetup.call(this, html);

            it('initializes correctly for unauthenticated user', function() {
                // WHEN application header is rendered

                // THEN sign in and sign up buttons are available
                var buttons = this.$element.find('button');
                expect(buttons.length).toEqual(2);
                expect(angular.element(buttons[0]).text()).toEqual('Sign in');
                expect(angular.element(buttons[1]).text()).toEqual('Sign up');
            });
        });

        describe('AppHeader directive', function() {

            var $state = {
                includes: function() {
                    return true;
                },

                href: function(state) {
                    return '/#!/' + state;
                }
            }

            // GIVEN current page is login page
            AppTestUtils.appTestSetup.call(this, html, null, null, null, function() {
                module(function($provide) {
                    $provide.value('$state', $state);
                });
            });

            it('initializes correctly for login page', function() {
                // WHEN application header is rendered

                // THEN sign in and sign up buttons are not available
                var buttons = this.$element.find('button');
                expect(buttons.length).toEqual(0);
            });
        });

        describe('AppHeader directive', function() {

            // GIVEN authenticated user
            AppTestUtils.appTestSetup.call(this, html, null, null, null, function() {
                AppTestUtils.login();
            });

            it('initializes correctly for authenticated user', function() {
                // WHEN application header is rendered

                // THEN sign in and sign out buttons are not available
                var buttons = this.$element.find('button');
                expect(buttons.length).toEqual(0);

                // AND actions dropdown is present
                expect(this.$element.find('menu-dropdown').length).toEqual(1);

                // AND dropdown items are correct
                var elements = this.$element.find('menu-dropdown li');
                expect(angular.element(elements[0]).text().trim()).toEqual('My profile');
                expect(angular.element(elements[1]).text().trim()).toEqual('Sign out');
            });
        });
    });

})(define, describe);
