/**
 * @fileOverview
 * Column builder for DataTables.
 */
define([
    'common/toolbox',
    'common/lastmodified',
    'common/html'
], function(Toolbox, LastModified, htmlLib) {

    var DataTablesColumnBuilder = Toolbox.BaseClass.extend({

        constructor: function(columnData, appLogger, $scope, $attrs) {

            // This column may have been incorrectly defined
            if (!columnData.data && appLogger && !columnData.hasOwnProperty('orderable')) {
                appLogger.warn('Column definition has no data field!');
                appLogger.warn(columnData);
            }

            this.data = {
                'title': columnData.title || '',
                'className': columnData.className || 'center',
                'width': columnData.width || null,
                'data': columnData.data || function(row, type, val, meta) {
                    return row;
                }
            };

            for (var key in columnData) {
                if (key) {
                    // These have been added to base column data already
                    if (key === 'title' || key === 'className' || key === 'width' || key === 'data') {
                        continue;
                    }

                    // Local implementation exists for the attribute
                    if (this[key]) {
                        this[key](columnData, $scope, $attrs);
                    }
                    else {
                        // Use as is
                        this.data[key] = columnData[key];
                    }
                }
            }
        },

        /**
         * Column has custom rendering implementation that is being defined in the parent scope.
         */
        render: function (columnData, $scope) {
            this.data.render = function(data, type, full, meta) {
                return $scope.$parent[columnData.render](data, type, full, meta);
            };
        },

        renderMediaType: function (columnData) {
            this.data.render = function(data, type, full, meta) {
                /*jshint camelcase: false */
                return htmlLib.media_type('', {
                    type: full[columnData.renderMediaType]
                });
                /*jshint camelcase: true */
            };
        },

        renderAppLink: function (columnData) {
            this.data.render = function(data, type, full, meta) {
                /*jshint camelcase: false */
                return htmlLib.a(full[columnData.renderAppLink.name], {
                    ui_sref: columnData.renderAppLink.fn(full)
                });
                /*jshint camelcase: true */
            };
        },

        renderLastModified: function (columnData) {
            this.data.render = function(data, type, full, meta) {
                var key = (columnData.renderLastModified === true) ? 'last_modified' : columnData.renderLastModified;
                return new LastModified(full[key]).timeAgoHTML();
            };
        },

        renderActions: function (columnData, $scope, $attrs) {
            this.data.width = '5%';
            this.data.orderable = false;
            this.data.render = function(data, type, full, meta) {
                return '<table-data-item-actions id="' + full.id + '" dt-table="$$dataTable" ' +
                    'model="' + $attrs.model + '"></table-data-item-actions>';
            };
        }
    });

    return DataTablesColumnBuilder;
});
