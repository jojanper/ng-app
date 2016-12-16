(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'utils/common/signals'
    ];

    define(dependencies, function(AppBootstrap, Signals) {

        var title = 'Actions';

        describe('ActionsMenu directive', function() {
            var html = '<model-viewer model="mediafolder" model-id="{{ id }}"></model-viewer>';

            var historyUrl = '/api/generic/media/mediafolder/3/history?draw=1&columns%5B0%5D%5Bdata%5D=' +
                    'modified_by&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5B' +
                    'orderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D' +
                    '=false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D' +
                    '=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5B' +
                    'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&' +
                    'search%5Bvalue%5D=&search%5Bregex%5D=false';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.id = 3;
            }, function($httpBackend, $templateCache) {
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                $httpBackend.whenGET('/api/generic/media/mediafolder/meta')
                    .respond(200, AppTestResponses.metaDataResponse.simple);

                $httpBackend.whenGET('/api/generic/media/mediafolder/3')
                    .respond(200, AppTestResponses.modelDetailsResponse.simple);

                $httpBackend.whenGET(historyUrl).respond(200, AppTestResponses.modelItemHistoryResponse.simple);

                $httpBackend.whenGET(historyUrl.replace('draw=1', 'draw=2'))
                    .respond(200, AppTestResponses.modelItemHistoryResponse.simple);

                $httpBackend.whenPOST('/api/generic/media/mediafolder/3/actions/edit').respond(200, {data: {}});
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {

                // GIVEN model viewer element

                // WHEN element is created

                var tabsHeader = this.$element.find('.nav-tabs li a');
                var tabPanes = this.$element.find('.tab-pane');

                // THEN tabset includes 2 tabs
                expect(tabsHeader.length).toEqual(2);
                expect($(tabsHeader[0]).html()).toEqual('Details');
                expect($(tabsHeader[1]).html()).toEqual('Change history');
                expect(tabPanes.length).toEqual(2);

                // AND first tab includes model data as form
                expect($(tabPanes[0]).find('form[name="modelEdit"]').length).toEqual(1);

                // AND second tabs includes change history for the model
                expect($(tabPanes[1]).find('tbody tr').length).toEqual(1);
            });

            it('model data is saved', function() {
                // GIVEN model viewer element

                // WHEN saving model data
                var tabPanes = this.$element.find('.tab-pane');
                var form = $(tabPanes[0]).find('form[name="modelEdit"]');
                spyOn(this.network, 'get').and.callThrough();
                expect(this.network.get.calls.count()).toEqual(0);
                AppTestUtils.click(form.find('button')[0], form.scope());
                this.$httpBackend.flush();

                // THEN history table gets updated
                expect(this.network.get.calls.count()).toEqual(1);
            });
        });
    });

})(define, describe);
