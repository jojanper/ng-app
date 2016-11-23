/**
 * Options builder for DataTables.
 */
define([
    'angular',
    'common/toolbox',
    'utils/datatables/dtrowdetails',
    'utils/datatables/dttheme',
    './plugins/dataTables.bootstrap_dtplugin',
    './plugins/fnSetFilteringDelay_dtplugin'
], function(angular, Toolbox, DtRowDetails, DtThemeBuilder) {

    /**
     * Default table options in use. For full list see https://datatables.net/reference/option/ -
     * Click the "DataTables - Features" and "DataTables - Options" buttons.
     */
    var defaultOptions = {

        /**
         * Feature control DataTables' server-side processing mode.
         *
         * Description
         * DataTables has two fundamental modes of operation:
         *
         * Client-side processing - where filtering, paging and sorting calculations are all performed
         *                          in the web-browser.
         * Server-side processing - where filtering, paging and sorting calculations are all performed
         *                          by a server.
         */
        "serverSide": false,

        /**
         * Destroy any existing table matching the selector and replace with the new options.
         *
         * Description
         * Initialise a new DataTable as usual, but if there is an existing DataTable which matches the selector, it
         * will be destroyed and replaced with the new table. This can be useful if you want to change a property of
         * the table which cannot be altered through the API.
         */
        "destroy": true,

        /**
         * Enable or disable table pagination.
         *
         * Description
         * DataTables can split the rows in tables into individual pages, which is an efficient method of showing a
         * large number of records in a small space. The end user is provided with controls to request the display
         * of different data as the navigate through the data. This feature is enabled by default, but if you wish to
         * disable it, you may do so with this parameter.
         */
        "paging": true,

        /**
         * Pagination button display options
         *
         * Description
         * The pagination option of DataTables will display a pagination control below the table (by default, its
         * position can be changed using domDT and CSS) with buttons that the end user can use to navigate the pages
         * of the table. Which buttons are shown in the pagination control are defined by the option given here.
         *
         * DataTables has four built-in paging button arrangements:
         *
         * simple - 'Previous' and 'Next' buttons only
         * simple_numbers - 'Previous' and 'Next' buttons, plus page numbers
         * full - 'First', 'Previous', 'Next' and 'Last' buttons
         * full_numbers - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
         */
        "pagingType": "full_numbers",

        /**
         * Feature control DataTables' smart column width handling
         *
         * Description
         * Enable or disable automatic column width calculation. This can be disabled as an optimisation
         * (it takes a finite amount of time to calculate the widths) if the tables widths are passed in
         * using columns.width.
         */
        "autoWidth": false,

        /**
         * Change the options in the page length select list.
         *
         * Description
         * This parameter allows you to readily specify the entries in the length drop down select list that
         * DataTables shows when pagination is enabled. It can be either:
         *
         * 1D array of integer values which will be used for both the displayed option and the value to use
         * for the display length, or
         *
         * 2D array which will use the first inner array as the page length values
         * and the second inner array as the displayed options. This is useful for language strings such as 'All').
         *
         * The page length values must always be integer values > 0, with the sole exception of -1. When -1 is used
         * as a value this tells DataTables to disable pagination (i.e. display all rows).
         */
        "lengthMenu": [5, 10, 15],

        /**
         * Feature control the end user's ability to change the paging display length of the table.
         *
         * Description
         * When pagination is enabled, this option will control the display an option for the end user to change
         * number of records to be shown per page. The options shown in the list are controlled by the lengthMenu
         * configuration option.
         */
        "lengthChange": true,

        /**
         * Change the initial page length (number of rows per page).
         */
        "pageLength": 5,

        /**
         * Initial order (sort) to apply to the table.
         */
        "order": [[0, 'asc']]
    };

    // Options mapping from HTML attribute value to DT value
    var optionsMapping = {
        jquery: 'jQueryUI'
    };

    var DataTablesOptionsBuilder = Toolbox.BaseClass.extend({

        /**
         * Options creator for DataTables.
         *
         * @public
         * @class DataTablesOptionsBuilder
         *
         * @param {Object=} options Table options.
         */
        constructor: function(options) {
            this.themeObj = null;
            this.options = angular.extend({}, options || {});
        },

        /**
         * Create datatable options from input attributes.
         *
         * @public
         * @instance
         * @memberOf DataTablesOptionsBuilder
         *
         * @param {Object} attrs Table attributes.
         * @param {Object} $scope Scope object.
         * @return {Object} Table options.
         */
        initDtOptions: function(attrs, $scope) {
            this.themeObj = new DtThemeBuilder(attrs);

            // Load default options
            angular.extend(this.options, defaultOptions);

            // Load customized options from attributes
            for (var key in attrs) {

                // Map the attribute key to internal key and evaluate value
                if (optionsMapping.hasOwnProperty(key)) {
                    this.options[optionsMapping[key]] = $scope.$eval(attrs[key]);
                }

                // Evaluate Datatables related key value
                else if (key.startsWith('dt')) {
                    var optKey = key.slice(2).lowerCaseFirstLetter();
                    this.options[optKey] = $scope.$eval(attrs[key]);
                    if (this.options[optKey] === undefined) {
                        this.options[optKey] = attrs[key];
                    }
                }
            }

            // Include theme related options
            angular.extend(this.options, this.themeObj.themeCall('options'));

            return this.options;
        },

        /**
         * Create row details data to table options. This should be used when creating manually
         * the row options for the table and not via the row directive (using HTML). The HTML template
         * uses <row-details> HTML tag which dynamically includes the row details to table
         * options.
         *
         * @public
         * @instance
         * @memberOf DataTablesOptionsBuilder
         *
         * @param {Object} options Input row options for table.
         * @return {Object} Table options including row details.
         */
        initDtRowOptions: function(options) {
            angular.extend(this.options, DtRowDetails.createOptions(options));
            return this.options;
        },

        /**
         * Interface to manage table themes.
         *
         * @public
         * @instance
         * @memberOf DataTablesOptionsBuilder
         *
         * @param {string} method Theme method to call.
         * @param {Object} dtTable DataTables object.
         * @return {string|undefined} Result of operation.
         */
        themeCall: function(method, dtTable) {
            if (this.themeObj) {
                return this.themeObj.themeCall(method, dtTable);
            }

            return '';
        }
    });

    return DataTablesOptionsBuilder;
});
