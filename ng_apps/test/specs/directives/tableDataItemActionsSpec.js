(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'utils/common/signals'
    ];

    var actionsData = [
        {
            id: 1,
            actions: {
                delete: {
                    url: '/api/1/delete',
                    display_name: 'Delete',
                    method: 'POST'
                },
                approve: {
                    url: '/api/1/approve',
                    display_name: 'Approve',
                    method: 'POST'
                },
                download: {
                    url: '/api/1/approve',
                    display_name: 'Download',
                    method: 'GET'
                }
            }
        },
        {
            id: 2,
            actions: {
                approve: {
                    url: '/api/1/approve',
                    display_name: 'Approve',
                    method: 'POST'
                }
            }
        }
    ];

    define(dependencies, function(AppBootstrap, Signals) {

        describe('tableDataItemActions directive', function() {

            var html = '<table-data-item-actions id="1" dt-table="tableData" model="upload"></table-data-item-actions>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.tableData = {
                    data: function() {
                        return actionsData;
                    }
                };
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                var actionsEl = this.$element.find('a');
                expect(actionsEl.length).toEqual(3);
                expect($(actionsEl[0]).text()).toEqual(actionsData[0].actions.delete.display_name);
                expect($(actionsEl[1]).text()).toEqual(actionsData[0].actions.approve.display_name);

                expect($(actionsEl[2]).prop('href')).toContain(actionsData[0].actions.download.url);
                expect($(actionsEl[2]).text()).toEqual(actionsData[0].actions.download.display_name);
            });

            it('action is clicked', function() {

                spyOn(this.$elementScope.$root, '$emit').and.callThrough();
                this.$httpBackend.whenPOST(actionsData[0].actions.delete.url).respond(200, {data: {}});

                // GIVEN action item in dropdown menu
                var actionsEl = this.$element.find('a');

                // WHEN action is clicked
                $(actionsEl[0]).click();
                this.$scope.$digest();
                this.$httpBackend.flush();

                // THEN event is triggered on success
                expect(this.$elementScope.$root.$emit).toHaveBeenCalled();

                // AND event is table reload signal
                var recentCallArgs = this.$elementScope.$root.$emit.calls.mostRecent().args;
                expect(recentCallArgs[0]).toEqual(Signals.tableReload.name);

                // AND event data is correct
                expect(recentCallArgs[1].data).toEqual({model: 'upload'});
            });
        });
    });

})(define, describe);
