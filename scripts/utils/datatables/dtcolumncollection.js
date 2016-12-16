/**
 * @fileOverview
 * Column collection for DataTables.
 */
define([
    'common/toolbox',
    'utils/datatables/dtcolumns'
], function(Toolbox, DtColumnBuilder) {

    var DataTablesColumnCollection = Toolbox.BaseClass.extend({

        constructor: function ($scope, $attrs) {
            this.columns = [];
            this.$scope = $scope;
            this.$attrs = $attrs;
        },

        addColumn: function (data, appLogger) {
            if (data.$attr) {
                for (var key in data.$attr) {
                    // Evaluate attribute
                    if (data[key] === 'true' || data[key] === 'false') {
                        data[key] = this.$scope.$eval(data[key]);
                    }

                    // Specific column setup, if any
                    else if (this[key]) {
                        if (!this[key](data, key)) {
                            return;
                        }
                    }
                }
            }

            this.columns.push(new DtColumnBuilder(data, appLogger, this.$scope, this.$attrs).data);
        },

        getColumns: function () {
            return this.columns;
        },

        renderAppLink: function (data, key) {
            // Invalid data
            if (!data.linkName || !data.linkId) {
                return false;
            }

            data[key] = {
                name: data[key],
                fn: function(dataRow) {
                    return data.linkName + '({id:' + dataRow[data.linkId] + '})';
                }
            };

            return true;
        }
    });

    return DataTablesColumnCollection;
});
