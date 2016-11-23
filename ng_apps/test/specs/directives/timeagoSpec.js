(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'common/lastmodified'
    ];

    define(dependencies, function(AppBootstrap, LastModified) {

        var appName = 'app';

        describe('Timeago directive', function() {

            beforeEach(module(appName));

            var $scope, $element, html;

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var date = new Date();
                html = new LastModified(date.toISOString()).timeAgoHTML();

                var obj = AppTestUtils.ngCreateElement($rootScope, $compile, html);
                $scope = obj.$scope;
                $element = obj.$element;
            }));

            it('initializes correctly', function() {
                expect($element.text()).toEqual('less than a minute ago');
            });
        });
    });

})(define, describe);
