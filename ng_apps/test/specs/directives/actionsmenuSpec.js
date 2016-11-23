(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'utils/common/signals'
    ];

    define(dependencies, function(AppBootstrap, Signals) {

        var title = 'Actions';

        describe('ActionsMenu directive', function() {
            var html = '<actions-menu model="mediafolder" actions-mode="create" action="create" title="' +
                    title + '"></actions-menu>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
            }, function($httpBackend, $templateCache) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
                $httpBackend.whenGET('/api/generic/media/mediafolder/meta')
                    .respond(200, AppTestResponses.metaDataResponse.simple);
                $httpBackend.whenPOST('/api/generic/media/mediafolder/actions/create').respond(200, {data: {}});
            });

            afterEach(function() {
                this.$scope.$destroy();
                $('.modal').remove();
            });

            it('initializes correctly', function() {

                // GIVEN actions menu directive

                // WHEN directive is initialized
                var element = this.$element.find('ul > li');

                // THEN action item must be present
                expect(element.length).toEqual(1);

                // AND action link must be correct
                expect(element.find('a').html()).toEqual('Create');

                // AND no form inputs are present
                expect($('form[name="modelCreateForm"]').find('app-input').length).toEqual(0);


                // WHEN clicking action link
                AppTestUtils.click(element.find('a'), this.$scope);
                this.$rootScope.$digest();

                // THEN dialog is created and form should be visible
                expect($('form[name="modelCreateForm"]').find('app-input').length).toEqual(1);


                // WHEN submitting data
                this.$rootScope.$apply();
                var form = $('form[name="modelCreateForm"]');
                spyOn(this.$elementScope, 'submit').and.callThrough();
                AppTestUtils.click(form.find('button')[0], form.scope());

                // THEN data is send to server
                expect(this.$elementScope.submit).toHaveBeenCalled();
            });

            it('new model item is created', function() {
                // GIVEN model creation form is presented to user
                var element = this.$element.find('ul > li');
                spyOn(this.$elementScope.$root, '$emit').and.callThrough();
                AppTestUtils.click(element.find('a'), this.$scope);

                // WHEN create data is send to server
                this.$elementScope.submit({name: 'test'}, this.$elementScope.modelData.$postUrl);
                this.$rootScope.$apply();
                this.$httpBackend.flush();

                // THEN table reload signal is emitted on success
                expect(this.$elementScope.$root.$emit).toHaveBeenCalled();
            });
        });

        describe('ActionsMenu directive', function() {
            var html = '<actions-menu model="mediafolder2" actions-mode="create" action="create"></actions-menu>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
            }, function($httpBackend, $templateCache) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('reports error for unsupported action', function() {
                // GIVEN unsupported action

                // WHEN actions menu is loaded

                // THEN error should be present
                expect(this.appMessagesService.getMessages().length).toEqual(1);
            });
        });

        describe('ActionsMenu directive', function() {
            var html = '<actions-menu model="upload" actions-mode="create" action="upload"></actions-menu>';

            AppTestUtils.appTestSetup.call(this, html);

            afterEach(function() {
                this.$scope.$destroy();
                $('.modal').remove();
            });

            it('supports file upload wizard', function() {

                // GIVEN actions menu directive

                // WHEN directive is initialized
                var element = this.$element.find('ul > li');

                // THEN action item must be present
                expect(element.length).toEqual(1);

                // AND no upload view is present
                expect($('file-upload').length).toEqual(0);


                // WHEN clicking action link
                AppTestUtils.click(element.find('a'), this.$scope);
                this.$rootScope.$digest();

                // AND upload view is present
                expect($('file-upload').length).toEqual(1);
            });
        });
    });

})(define, describe);
