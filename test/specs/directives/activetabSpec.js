(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
    ];

    define(dependencies, function(AppBootstrap) {

        describe('ActiveTab directive', function() {

            // Instantiate tab element
            var element = '<ul>' +
                    '<li><a ui-sref="test" active-tab="/test">Test page</a></li>' +
                    '<li><a ui-sref="about" active-tab="/about">About</a></li>' +
                    '</ul>';

            AppTestUtils.appTestSetup.call(this, element);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('active tab should follow page changes', function() {

                // Test page is selected
                this.$location.path('test');
                this.$scope.$broadcast('$routeChangeSuccess');
                this.$scope.$digest();

                expect($(this.$element.find('.tabActiveHeader > a')[0]).prop('href')).toContain('#!/test');

                // About page is selected
                this.$location.path('about');
                this.$scope.$broadcast('$routeChangeSuccess');
                this.$scope.$digest();

                var list = this.$element.find('li');
                expect($(list[0]).hasClass('tabActiveHeader')).toBeFalsy();
                expect($(list[1]).hasClass('tabActiveHeader')).toBeTruthy();
            });

            it('handles $stateChangeSuccess event', function() {

                // Test page is selected
                this.$location.path('test');
                this.$scope.$broadcast('$stateChangeSuccess');
                this.$scope.$digest();

                var list = this.$element.find('li');
                expect($(list[0]).hasClass('tabActiveHeader')).toBeTruthy();
            });
        });
    });

})(define, describe);
