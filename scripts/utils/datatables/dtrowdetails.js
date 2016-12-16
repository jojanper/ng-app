/**
 * @fileOverview
 * Row details handling for DataTables.
 */
define([
    'jquery',
    'common/toolbox'
], function($, Toolbox) {

    var detailsClass = 'details';
    var detailsCtrlClass = 'details-control';

    /*
     * Base column definition for the details column.
     */
    var detailsColumn = {
        "class": detailsCtrlClass,
        "orderable": false,
        "title": "Details",
        "data": function (row, type, val, meta) {
            return row;
        },
        "render": function (data, type, full, meta) {
            return "<div>&nbsp</div>";
        }
    };

    var DataTablesRowDetails = Toolbox.BaseClass.extend({

        /**
         * Create object for DataTables row details handler.
         *
         * @public
         * @class DataTablesRowDetails
         *
         * @param {Object=} options Options for row details. The following properties must be present in options:
         * @param {Object} options.element HTML element
         * @param {Object} options.$scope Scope object
         */
        constructor: function(options) {
            this.options = options || {};
        },

        /**
         * Initialize row details rendering.
         *
         * @public
         * @instance
         * @memberOf DataTablesRowDetails
         *
         * @param {Object} dataTable DataTables object
         * @return {Object} This object.
         */
        initRowDetails: function(dataTable) {
            if (this.options.element && dataTable && this.options.scope) {
                var scope = this.options.scope;
                var element = this.options.element;

                // Handle opening and closing of the row details
                var tbody = element.find('tbody');
                tbody.on('click', '.' + detailsCtrlClass, function () {
                    var tr = $(this).closest('tr');
                    var row = dataTable.row(tr);

                    // Row is open, close it
                    if (row.child.isShown()) {
                        tr.removeClass(detailsClass);
                        row.child.hide();
                    }
                    // Open row details
                    else {
                        // Locate the row details index we are about to open
                        var clsList = $(this).attr('class').split(/\s+/);
                        var index = clsList.reIndexOf(/column-/);
                        index = clsList[index].split('-')[1];

                        // Render the details row
                        tr.addClass(detailsClass);
                        var fn = scope.options.rowDetails[index].detailsCallback;
                        var html = '<div class="table-row-details-container" style="padding: 5px;">' +
                            fn(row.data()) + '</div>';
                        row.child(html).show();
                    }
                });
            }

            return this;
        },

        /**
         * Include details rendering definition to table column data.
         *
         * @public
         * @instance
         * @memberOf DataTablesRowDetails
         */
        includeRowDetails: function() {
            if (this.options && this.options.element && this.options.scope) {
                var i, j;
                var scope = this.options.scope;
                var element = this.options.element;
                var options = scope.options;

                // No details present
                if (!options.rowDetails || !options.rowDetails.length) {
                    return this;
                }

                // Fetch the row details from options data
                var rowDetails = DataTablesRowDetails.rowDetailsArray(options);

                // Initialize columns
                this.columns = new Array(options.columns.length + rowDetails.length);
                for (i = 0; i < this.columns.length; i++) {
                    this.columns[i] = undefined;
                }

                // Initialize row details columns
                for (i = 0; i < rowDetails.length; i++) {
                    if (rowDetails[i]) {
                        var columnData = $.extend({}, detailsColumn, rowDetails[i]);
                        columnData.class += ' column-' + i;
                        this.columns[rowDetails[i].columnIndex] = columnData;
                    }
                }

                // Include traditional columns
                for (i = 0, j = 0; i < options.columns.length; j++) {
                    if (this.columns[j] !== undefined) {
                        // Column reserved for details, skip
                        continue;
                    }
                    else {
                        this.columns[j] = options.columns[i];
                        i += 1;
                    }
                }

                // This is now the columns definition for the table
                scope.options.columns = this.columns;
            }

            return this;
        }
    });

    /**
     * Return row details data.
     *
     * @public
     * @static
     * @memberOf DataTablesRowDetails
     *
     * @param {Object} options Table options data.
     * @param {(Object|Array)} options.rowDetails Row details data.
     * @return {Array} Row details data.
     */
    DataTablesRowDetails.rowDetailsArray = function (options) {
        var rowDetails;

        if (Array.isArray(options.rowDetails)) {
            rowDetails = options.rowDetails;
        }
        else {
            rowDetails = [options.rowDetails];
        }

        return rowDetails;
    };

    /**
     * Determine the row details from input options to table options object.
     *
     * @public
     * @static
     * @memberOf DataTablesRowDetails
     *
     * @param {Object} rowOptionsData Row input options data.
     * @return {Array} Row details for table options.
     */
    DataTablesRowDetails.createOptions = function (rowOptionsData) {
        var rowOptions = [];
        if (rowOptionsData && rowOptionsData.rowDetails) {
            var rowDetails = DataTablesRowDetails.rowDetailsArray(rowOptionsData);

            rowOptions = [];
            for (var i = 0; i < rowDetails.length; i++) {
                rowOptions.push({
                    title: rowDetails[i].title || 'No title',
                    columnIndex: rowDetails[i].columnIndex || 0,
                    detailsCallback: rowDetails[i].fn
                });
            }
        }

        return (rowOptions.length) ? {rowDetails: rowOptions} : {};
    };

    /**
     * Add row detail to table options object.
     *
     * @public
     * @static
     * @memberOf DataTablesRowDetails
     *
     * @param {Object} $scope Scope object.
     * @param {Object} $attrs Row detail attributes.
     * @param {Object} options Table options object.
     * @param {Object=} appLogger Logging object.
     */
    DataTablesRowDetails.addRowDetails = function ($scope, $attrs, options, appLogger) {

        // Details data is strored here
        if (!options.rowDetails) {
            options.rowDetails = [];
        }

        if ($attrs.render && $scope.$parent && $scope.$parent[$attrs.render]) {
            /*
             * Number of columns + number of row details added so far.
             */
            var colIndex = $scope.columnCollection.getColumns().length + options.rowDetails.length;

            options.rowDetails.push({
                title: $attrs.title || 'No title',
                columnIndex: colIndex,
                detailsCallback: $scope.$parent[$attrs.render]
            });
        }
        else if (appLogger) {
            appLogger.warn('No render attribute defined. Discarding row detail:');
            appLogger.warn($attrs);
        }
    };

    return DataTablesRowDetails;
});
