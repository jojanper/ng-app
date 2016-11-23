(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
    ];

    define(dependencies, function(AppBootstrap) {

        describe('Breadcrumb directive', function() {

            var element = '<breadcrumb></breadcrumb>';

            AppTestUtils.appTestSetup.call(this, element, null, function($httpBackend) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('should display page links and application models', function() {

                // GIVEN URL path
                var path = 'media';

                // WHEN switching to media application page
                this.$location.path(path);
                this.$scope.$broadcast('$stateChangeSuccess');
                this.$scope.$root.$digest();

                // THEN breadcrumb should be visible
                var breadcrumb = this.$element.find('div.btn');
                expect(breadcrumb.length).toEqual(1);
                breadcrumb = this.$element.find('.breadcrumb-last');
                expect($(breadcrumb[0]).html()).toEqual('Admin');

                // AND available application models should be present in dropdown menu
                expect(this.$element.find('.app-page-breadcrumb li a').length).toEqual(2);
                expect($(this.$element.find('.dropdown-toggle')[0]).html().trim())
                    .toEqual('Select view <span class="caret"></span>');


                // WHEN switching to mediafolder model item details page
                var id = '4';
                this.$location.path('media/mediafolder/' + id);
                this.$scope.$root.$broadcast('$stateChangeSuccess');
                this.$scope.$root.$digest();

                // THEN details should be visible in breadcrumb
                breadcrumb = this.$element.find('div.btn');
                expect(breadcrumb.length).toEqual(3); // breadcrumb is Admin / Media folder / 4
                expect($($(breadcrumb[0]).find('a')[0]).html()).toEqual('Admin');
                expect($($(breadcrumb[1]).find('a')[0]).html()).toEqual('Media folder');
                expect($($(breadcrumb[2]).find('.breadcrumb-last')[0]).html()).toEqual(id);

                // AND available application models should be present in dropdown menu
                expect(this.$element.find('.app-page-breadcrumb li a').length).toEqual(2);
                expect($(this.$element.find('.dropdown-toggle')[0]).html().trim())
                    .toEqual('Media folder <span class="caret"></span>');


                // WHEN switching to about page
                this.$location.path('about');
                this.$scope.$root.$broadcast('$stateChangeSuccess');
                this.$scope.$root.$digest();

                // THEN breadcrumb should be visible
                breadcrumb = this.$element.find('div.btn');
                expect(breadcrumb.length).toEqual(1);
                breadcrumb = this.$element.find('.breadcrumb-last');
                expect($(breadcrumb[0]).html()).toEqual('About');

                // AND no application models should be present in dropdown menu
                expect(this.$element.find('.app-page-breadcrumb li a').length).toEqual(0);
                expect(this.$element.find('.dropdown-toggle').length).toEqual(0);
            });
        });
    });

})(define, describe);
