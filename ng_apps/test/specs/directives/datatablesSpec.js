(function(define, describe) {
    "use strict";

    var dependencies = [
        'jquery',
        'bootstrap',
        'utils/datatables/dtcolumns',
        'utils/datatables/dtoptions',
        'utils/datatables/dtrowdetails',
        'utils/common/signals',
        'utils/models/model'
    ];

    var playlistUrl = '/api/playlist';

    var playlistResponse = {
        "recordsTotal": 74,
        "recordsFiltered": 74,
        "draw": "1",
        "aaData": [
            {
                "id": 89,
                "name": "My audio playlist",
                "mode": 0,
                "last_modified": "2014-09-23T21:00:00Z",
                actions: {
                    approve: {
                        url: '/api/1/approve',
                        display_name: 'Approve',
                        method: 'POST'
                    }
                }
            },
            {
                "id": 90,
                "name": "image2",
                "mode": 2,
                "last_modified": "2014-09-23T21:00:00Z",
                actions: {
                    approve: {
                        url: '/api/1/approve',
                        display_name: 'Approve',
                        method: 'POST'
                    }
                }
            },
        ]
    };

    define(dependencies, function($, AppBootstrap, DtColumnBuilder, DtOptionsBuilder, DtRowDetails, Signals, BaseModel) {

        var playlistModelUrl = '/api/generic/models/playlist';

        describe('AppTable directive with options', function() {

            var playlistFullUrl = playlistModelUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function&' +
                    'columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable' +
                    '%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D' +
                    '=false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5B' +
                    'searchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue' +
                    '%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=function&columns' +
                    '%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true' +
                    '&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns' +
                    '%5B3%5D%5Bdata%5D=function&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&' +
                    'columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5B' +
                    'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&' +
                    'length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            var html = '<app-table model="playlist" dt-server_side="true" options="options" jquery="true"></app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {

                var rowOptions = new DtOptionsBuilder().initDtRowOptions({
                    rowDetails: [{
                        fn: function(rowData) {
                            return 'This is row details for ' + rowData.name;
                        }
                    }]
                });

                var columnsData = [
                    new DtColumnBuilder({title: 'Type', renderMediaType: 'mode', sortable: false}).data,
                    new DtColumnBuilder({title: 'Playlist', renderAppLink: {
                        name: 'name',
                        fn: function(data) {
                            return 'playlists.edit({id:' + data.id + '})';
                        }
                    }}).data,
                    new DtColumnBuilder({title: 'Last modified', renderLastModified: true}).data,
                ];

                scope.options = {
                    columns: columnsData
                };
                scope.options = angular.extend(scope.options, rowOptions);

            }, function($httpBackend) {
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);

                // Data for URL resolving
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('table').length).toBeTruthy();
            });

            it('row details are opened and closed', function() {
                var text = 'This is row details for ' + playlistResponse.aaData[0].name;

                // Open row details
                AppTestUtils.click(this.$element.find('.details-control'), this.$scope);
                expect($(this.$element.find('tr')[2]).text()).toContain(text);

                // Close row details
                AppTestUtils.click(this.$element.find('.details-control'), this.$scope);
                expect($(this.$element.find('tr')[2]).text()).not.toContain(text);
            });

            it('column is hidden', function() {
                var menuElement = this.$element.find('input[type=checkbox]');

                // Hide column
                menuElement[0].click();
                this.$scope.$digest();
                expect(this.$element.find('table tr:eq(1) td').length).toEqual(3);

                // Unhide column
                menuElement[0].click();
                this.$scope.$digest();
                expect(this.$element.find('table tr:eq(1) td').length).toEqual(4);
            });

            it('custom option is initialized correctly', function() {
                expect(this.$scope.options.jQueryUI).toEqual(true);
            });

            it('responds to reload requests', function() {

                spyOn(this.network, 'get').and.callThrough();
                expect(this.network.get.calls.count()).toEqual(0);
                var model = new BaseModel();
                model.$model = 'playlist';

                // GIVEN table data has been updated by some UI component

                // WHEN the UI component sends table reload signal
                var signal = new Signals.tableReload.cls(this.$scope, {model: model});
                this.$scope.$root.$emit(Signals.tableReload.name, signal);

                // THEN table data is reloaded
                expect(this.network.get.calls.count()).toEqual(1);
            });
        });

        describe('AppTable directive with HTML column definitions', function() {

            var playlistFullUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function&columns' +
                '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D' +
                '=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=' +
                'false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5B' +
                'searchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5B' +
                'value%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order' +
                '%5B0%5D%5Bdir%5D=asc&start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            var html = '<app-table dt-server-side="true" no-column-hide options="options" theme="fixed">' +
                    '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                    '<app-column title="Playlist" render-app-link="name" link-name="playlists.edit" link-id="id">' +
                    '</app-column></app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
            }, function($httpBackend) {
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('table').length).toBeTruthy();
                expect(this.$element.find('table tr').length).toEqual(playlistResponse.aaData.length + 1);
            });

            it('headerless theme is setup correctly', function() {
                var element = $(this.$element.find('table thead')[0]);
                expect(element.css('display')).toEqual('none');
            });

            it('column visibility changes are disabled', function() {
                expect(this.$element.find('checkbox-menu-dropdown').length).toEqual(0);
            });
        });

        describe('AppTable directive without column definitions', function() {

            var html = '<app-table dt-server-side="true"></app-table>';
            AppTestUtils.appTestSetup.call(this, html);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('does not initialize', function() {
                expect(this.$element.find('table').length).toBeTruthy();
                expect(this.$element.find('table tr').length).toEqual(0);
            });
        });

        describe('AppTable directive with renderAppLink', function() {

            var html = '<app-table dt-server-side="true" options="options">' +
                    '<app-column title="Playlist" render-app-link="name" link-id="id">' +
                    '</app-column></app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('does not initialize', function() {
                // renderAppLink is incorrect -> no columns data -> no rows in table
                expect(this.$element.find('table').length).toBeTruthy();
                expect(this.$element.find('table tr').length).toEqual(0);
            });
        });

        describe('AppTable directive with render attribute', function() {

            var renderCalled = false;

            var renderUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function&columns' +
                    '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true' +
                    '&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%' +
                    '5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            var html = '<app-table dt-server-side="true" options="options">' +
                    '<app-column title="Test" render="renderColumn"></app-column></app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
                scope.renderColumn = function() {
                    renderCalled = true;
                    return '';
                };
            }, function($httpBackend) {
                $httpBackend.whenGET(renderUrl).respond(200, playlistResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('calls render function', function() {
                expect(renderCalled).toBeTruthy();
            });
        });

        describe('DataTablesOptionsBuilder', function() {

            it('has no theme object initialized', function() {
                var optionsObj = new DtOptionsBuilder();
                expect(optionsObj.themeCall()).toEqual('');
            });
        });

        describe('DataTablesRowDetails', function() {

            AppTestUtils.appTestSetup.call(this);

            it('rowDetailsArray returns correct data', function() {
                var options = {rowDetails: 'details'};
                var rowDetails = DtRowDetails.rowDetailsArray(options);
                expect(Array.isArray(rowDetails)).toBeTruthy();
                expect(rowDetails[0]).toEqual(options.rowDetails);
            });

            it('addRowDetails reports warning on invalid data', function() {

                var options = {};
                spyOn(this.appLogger, 'warn').and.callThrough();

                // GIVEN invalid row details
                var $attrs = {};

                // WHEN adding row details
                DtRowDetails.addRowDetails(this.$scope, $attrs, options, this.appLogger);

                // THEN warnings are logged
                expect(this.appLogger.warn.calls.count()).toEqual(2);

                // AND nothing is added to table options regarding row details
                expect(options.rowDetails.length).toEqual(0);
            });
        });

        describe('AppTable directive with bootstrap theme', function() {

            var playlistFullUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function' +
                    '&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D' +
                    '%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5B' +
                    'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&' +
                    'start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            var html = '<visibility-viewer></visibility-viewer>' +
                        '<app-table dt-server-side="true" no-column-hide options="options" theme="bootstrap">' +
                        '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                        '</app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
            }, function($httpBackend) {
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('.bootstrap-dt-table').length).toEqual(1);
            });

            it('table element is closed and restored', function() {

                // WHEN closing element
                AppTestUtils.click(this.$element.find('.element-close'), this.$scope);

                // THEN it should be in hidden state
                expect($(this.$element[1]).hasClass('hidden')).toBeTruthy();

                // AND visibility controller has ownership of the element
                var elements = $(this.$element[0]).scope().elements;
                expect(elements.length).toEqual(1);
                expect(elements[0].title).toEqual('Element has no name');
                expect(elements[0].index).toEqual(0);


                // WHEN restoring table visibility
                AppTestUtils.click(this.$element.find('.visibility-restore')[0], this.$scope);

                // THEN table should be visible
                expect($(this.$element[1]).hasClass('hidden')).toBeFalsy();

                // AND visibility controller has no elements in local storage
                elements = $(this.$element[0]).scope().elements;
                expect(elements.length).toEqual(0);
            });

            it('table visibility element disappears on page change', function() {

                // GIVEN element in visibility container
                AppTestUtils.click(this.$element.find('.element-close'), this.$scope);

                // WHEN signal is sent to flush visibility items
                this.$scope.$root.$broadcast(Signals.visibilityFlush.name, new Signals.visibilityFlush.cls(this.$scope));

                // THEN visibility controller has no elements in local storage
                var elements = $(this.$element[0]).scope().elements;
                expect(elements.length).toEqual(0);
            });
        });

        var tableLoadingUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function' +
                '&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D' +
                '%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5B' +
                'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&' +
                'start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

        var tableHtml = '<app-table dt-server-side="true" %s no-column-hide options="options" theme="bootstrap-simple">' +
                '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                '</app-table>';

        function tableSpinnerSetup(html, dataUrl) {
            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
            }, function($httpBackend) {
                $httpBackend.whenGET(dataUrl).respond(200, playlistResponse);
            });
        }

        describe('AppTable directive with bootstrap-simple theme', function() {

            tableSpinnerSetup.call(this, $.sprintf(tableHtml, ""), tableLoadingUrl);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('.bootstrap-dt-table-simple').length).toEqual(1);
            });

            it('spinner is hidden', function() {
                // Spinner element is present but not visible
                expect(this.$element.find('spinner').length).toEqual(1);
                expect($(this.$element.find('spinner .spinner-loader')[0]).hasClass('hidden')).toBeTruthy();
            });
        });

        describe('AppTable directive without spinner', function() {

            tableSpinnerSetup.call(this, $.sprintf(tableHtml, 'no-spinner'), tableLoadingUrl);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('spinner is not present', function() {
                expect(this.$element.find('spinner').length).toEqual(0);
            });
        });

        describe('AppTable directive with spinner', function() {

            var $httpBackend;

            beforeEach(module("app.templates"));
            beforeEach(module('app'));

            beforeEach(inject(function(_$rootScope_, $compile, _$httpBackend_) {
                $httpBackend = _$httpBackend_;
                _$httpBackend_.whenGET(tableLoadingUrl).respond(200, playlistResponse);

                var obj = AppTestUtils.ngCompileElement(_$rootScope_, $compile, tableHtml, function(scope) {
                    scope.options = {
                        baseUrl: playlistUrl
                    };
                });

                this.$scope = obj.$scope;
                this.$element = obj.$element;
                this.$rootScope = _$rootScope_;
            }));

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {

                // GIVEN table component with loading spinner
                // WHEN table data is being loaded

                // THEN spinner should be present
                expect(this.$element.find('spinner').length).toEqual(1);

                // AND is visible to user
                expect($(this.$element.find('spinner .spinner-loader')[0]).hasClass('hidden')).toBeFalsy();

                // -----

                // WHEN table data has been loaded
                $httpBackend.flush();

                // THEN spinner should not be visible to user
                expect($(this.$element.find('spinner .spinner-loader')[0]).hasClass('hidden')).toBeTruthy();
            });
        });

        describe('AppTable directive uses <row-details> HTML element', function() {

            var playlistFullUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function&columns' +
                    '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable' +
                    '%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex' +
                    '%5D=false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5B' +
                    'searchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue' +
                    '%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=function&columns' +
                    '%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&' +
                    'columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns' +
                    '%5B3%5D%5Bdata%5D=function&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&' +
                    'columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5B' +
                    'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&' +
                    'length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            // Table HTML where 1st and third columns use row details
            var html = '<app-table dt-server-side="true" no-column-hide options="options" theme="bootstrap">' +
                    '<row-details title="First details" render="render"></row-details>' +
                    '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                    '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                    '<row-details title="Details" render="render"></row-details>' +
                    '</app-table>';

            var rowDetailsCalled = false;

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.options = {
                    baseUrl: playlistUrl
                };
                scope.render = function() {
                    rowDetailsCalled = true;
                    return '';
                };

            }, function($httpBackend) {
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect($(this.$element.find('thead th')[0]).html()).toEqual('First details');
                expect($(this.$element.find('thead th')[3]).html()).toEqual('Details');
            });

            it('row details are rendered', function() {
                AppTestUtils.click(this.$element.find('.details-control'), this.$scope);
                expect(rowDetailsCalled).toBeTruthy();
            });
        });

        describe('AppTable directive with baseUrl', function() {

            var playlistFullUrl = playlistUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function' +
                    '&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D' +
                    '%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5B' +
                    'search%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&' +
                    'start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            // Table HTML where base-url attribute defines the server URL
            var html = '<app-table dt-server-side="true" no-column-hide base-url="{{ baseUrl }}" theme="bootstrap">' +
                    '<app-column title="Type" render-media-type="mode" sortable="false"></app-column>' +
                    '</app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.baseUrl = playlistUrl;
            }, function($httpBackend) {
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('thead th').length).toEqual(1);
                expect(this.$element.find('tbody tr').length).toEqual(playlistResponse.aaData.length);
            });
        });

        describe('AppTable directive with model attribute defined', function() {

            var playlistFullUrl = playlistModelUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=function&columns' +
                    '%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable' +
                    '%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex' +
                    '%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search' +
                    '%5Bvalue%5D=&search%5Bregex%5D=false';

            // Table HTML where model attribute defines the server URL
            var html = '<app-table dt-server-side="true" model="playlist" theme="bootstrap" actions-menu action="create"' +
                    'actions-title="Media folder actions">' +
                    '<app-column title="Type" render-media-type="mode" orderable="false"></app-column>' +
                    '</app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
                scope.baseUrl = playlistUrl;
            }, function($httpBackend) {
                // Data for table
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);

                // Data for URL resolving
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);

                // Data for setting up actions menu
                $httpBackend.whenGET('/api/generic/models/playlist/meta').respond(200, AppTestResponses.metaDataResponse.simple);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                expect(this.$element.find('thead th').length).toEqual(1);
                expect(this.$element.find('tbody tr').length).toEqual(playlistResponse.aaData.length);
            });

            it('actions menu is present', function() {
                expect(this.$element.find('actions-menu a').length).toEqual(1);
            });
        });

        describe('AppTable directive with actions column', function() {

            var playlistFullUrl = playlistModelUrl + '?draw=1&columns%5B0%5D%5Bdata%5D=actions&' +
                    'columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5B' +
                    'orderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%' +
                    '5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&' +
                    'length=5&search%5Bvalue%5D=&search%5Bregex%5D=false';

            // Actions are present for table items
            var html = '<app-table dt-server-side="true" model="playlist" theme="bootstrap">' +
                    '<app-column title="Actions" data="actions" render-actions></app-column></app-table>';

            AppTestUtils.appTestSetup.call(this, html, function(scope) {
            }, function($httpBackend) {
                // Data for table
                $httpBackend.whenGET(playlistFullUrl).respond(200, playlistResponse);

                // Data for URL resolving
                $httpBackend.whenGET('/api/generic').respond(200, AppTestResponses.metaApiResponse);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                var actionsEl = this.$element.find('table-data-item-actions');
                expect(actionsEl.length).toEqual(playlistResponse.aaData.length);
            });

            it('table item action is clicked', function() {

                spyOn(this.$elementScope.$root, '$emit');
                this.$httpBackend.whenPOST(playlistResponse.aaData[0].actions.approve.url).respond(200, {data: {}});

                // GIVEN action item in table data
                var actionsEl = this.$element.find('table-data-item-actions').find('a');

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
                expect(recentCallArgs[1].data).toEqual({model: 'playlist'});
            });
        });
    });

})(define, describe);
