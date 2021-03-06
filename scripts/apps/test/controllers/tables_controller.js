define([
    'angular',
    'jquery',
    'utils/controllers/basecontroller',
    'utils/datatables/dtoptions',
    'utils/datatables/dtcolumns'
], function (angular, $, BaseCtrl, DtOptionsBuilder, DtColumnBuilder) {
    'use strict';

    var TestTablesController = BaseCtrl.extend({
        initialize: function() {
            this._buildDtOptions();

            this.$scope.options = this.options;

            this.$scope.render = function(rowData) {
                return 'This is row-details HTML for ' + rowData.name;
            };
        },

        _buildDtOptions: function() {
            var rowOptions = new DtOptionsBuilder().initDtRowOptions({
                rowDetails: [
                    {
                        columnIndex: 0,
                        title: 'Details 1',
                        fn: function(rowData) {
                            return 'This is row details for ' + rowData.name;
                        }
                    },
                    {
                        columnIndex: 2,
                        fn: function(rowData) {
                            return 'This is another row details for ' + rowData.name;
                        }
                    }
                ]
            });

            var columnsData = [
                new DtColumnBuilder({title: 'Type', renderMediaType: 'mode', sortable: false}).data,
                new DtColumnBuilder({title: 'Playlist', renderAppLink: {
                    name: 'name',
                    fn: function(data) {
                        return 'playlists.edit({id:' + data.id + '})';
                    }
                }}).data,
                new DtColumnBuilder({title: 'Last modified', renderLastModified: true}).data
            ];
            this.options.columns = columnsData;

            angular.extend(this.options, rowOptions);

            return this.options;
        }
    });

    return {
        feature: 'controller',
        name: 'TestTablesController',
        cls: ['$scope', TestTablesController]
    };
});
