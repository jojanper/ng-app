(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'apps/common/model_list',
        'apps/common/model_edit',
        'text!apps/media/controllers/templates/media_list.html'
    ];

    var modelListingUrl = '/api/generic/media/mediafolder?draw=1&columns%5B0%5D%5Bdata%5D=name&columns' +
            '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&' +
            'columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns' +
            '%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns' +
            '%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5B' +
            'regex%5D=false&order%5B0%5D%5Bcolumn%5D=1&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search%5Bvalue' +
            '%5D=&search%5Bregex%5D=false';

    var historyUrl = '/api/generic/media/mediafolder/3/history?draw=1&columns%5B0%5D%5Bdata%5D=' +
            'modified_by&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5B' +
            'orderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D' +
            '=false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D' +
            '=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5B' +
            'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&' +
            'search%5Bvalue%5D=&search%5Bregex%5D=false';

    define(dependencies, function(AppBootstrap, ModelListTemplate, ModelEditTemplate, MediaFolderListTemplate) {

        describe('Model lists view', function() {

            var element = ModelListTemplate(MediaFolderListTemplate);

            AppTestUtils.appTestSetup.call(this, element, null, function($httpBackend) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                $httpBackend.whenGET(modelListingUrl)
                    .respond(200, AppTestResponses.modelListingsResponse.mediafolder);

                $httpBackend.whenGET('/api/generic/media/mediafolder/meta')
                    .respond(200, AppTestResponses.metaDataResponse.simple);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('should display page links', function() {
                expect($(this.$element.find('table')[0]).find('tbody tr').length)
                    .toEqual(AppTestResponses.modelListingsResponse.mediafolder.aaData.length);

                expect($(this.$element.find('table')[0]).find('tbody td').length)
                    .toEqual(AppTestResponses.modelListingsResponse.mediafolder.aaData.length * 2);
            });
        });

        describe('Model details view', function() {

            var element = ModelEditTemplate('mediafolder');

            AppTestUtils.appTestSetup.call(this, element, function($scope, $stateParams) {
                $stateParams.id = AppTestResponses.modelDetailsResponse.simple.id;
            }, function($httpBackend) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                $httpBackend.whenGET(modelListingUrl)
                    .respond(200, AppTestResponses.modelListingsResponse.mediafolder);

                $httpBackend.whenGET('/api/generic/media/mediafolder/meta')
                    .respond(200, AppTestResponses.metaDataResponse.simple);

                $httpBackend.whenGET('/api/generic/media/mediafolder/3')
                    .respond(200, AppTestResponses.modelDetailsResponse.simple);

                $httpBackend.whenGET(historyUrl).respond(200, AppTestResponses.modelItemHistoryResponse.simple);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('should display page links', function() {

                expect(this.$element.find('form').length).toEqual(1);

                expect($(this.$element.find('table')[0]).find('tbody tr').length)
                    .toEqual(AppTestResponses.modelItemHistoryResponse.simple.aaData.length);

                expect($(this.$element.find('table')[0]).find('tbody td').length)
                    .toEqual(AppTestResponses.modelItemHistoryResponse.simple.aaData.length * 2);
            });
        });
    });

})(define, describe);
