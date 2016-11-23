(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'utils/common/signals'
    ];

    define(dependencies, function(AppBootstrap, Signals) {

        describe('Spinner directive', function() {
            var html = '<div ng-controller="EditController">' +
                    '<spinner type="default"></spinner>' +
                    '<menu-dropdown class="spinner-view" menu-items="menuItems"></menu-dropdown>' +
                    '</div>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.menuItems = [
                    {
                        link: '#/home',
                        text: 'This is a link'
                    }
                ];
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('loading state changes', function() {

                // GIVEN UI view that includes loading spinner
                // WHEN UI is rendered

                // THEN spinner should be visible
                var isSpinnerHidden = this.$element.find('spinner .spinner-loader:first').hasClass('hidden');
                expect(isSpinnerHidden).toBeFalsy();

                // AND UI view is hidden
                var isViewHidden = this.$element.find('.spinner-view:first').hasClass('hidden');
                expect(isViewHidden).toBeTruthy();

                // -----

                // WHEN data for UI view is available
                var actionElement = this.$element.find('ul > li > a');
                var scope = $(actionElement[0]).scope();
                scope.$emit(Signals.loader.name, self);
                scope.$digest();

                // THEN spinner should be hidden
                isSpinnerHidden = this.$element.find('spinner .spinner-loader:first').hasClass('hidden');
                expect(isSpinnerHidden).toBeTruthy();

                // AND UI view visible
                isViewHidden = this.$element.find('.spinner-view:first').hasClass('hidden');
                expect(isViewHidden).toBeFalsy();
            });
        });
    });

})(define, describe);
