(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('delayedSearch directive', function() {

            var searchCall;
            var html = '<delayed-search placeholder="Type something" delayed-method="searchCallback(search)"></delayed-search>';

            AppTestUtils.appTestSetup.call(this, html, function($scope) {
                $scope.searchCallback = function(search) {
                    searchCall = search;
                };
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('delayed method is called', function() {
                // GIVEN search input
                var input = this.$element.find('input');

                // WHEN text is typed to input
                input.val('yes');
                input.trigger('input');

                // THEN callback should not be called
                expect(searchCall).not.toEqual('yes');

                // -----

                // WHEN debounce time has elapsed
                this.$timeout.flush();

                // THEN callback should be called
                expect(searchCall).toEqual('yes');
            });
        });
    });

})(define, describe);
