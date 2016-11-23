/**
 * Controller for DataTables.
 */
define([
    './basecontroller',
    'utils/datatables/dtcolumncollection',
    'utils/datatables/dtcolumn_visibility',
    'utils/datatables/dtrowdetails',
    'utils/common/signals',
    'common/utils'
], function (BaseCtrl, DtColumnCollection, DtColumnVisibility, DtRowDetails, Signals, UtilsLib) {
    "use strict";

    var DataTablesCtrl = BaseCtrl.extend({

        initialize: function() {
            var self = this;

            this.appLogger = this.arguments[0];

            // Make sure options is present
            if (!this.$scope.options) {
                this.$scope.options = {};
            }

            // Column visibility handler
            this.$scope.$$dtColumnVisibilityObj = new DtColumnVisibility(this.$scope, this.$attrs);

            // Table column data is provided via column directives
            this.$scope.columnCollection = new DtColumnCollection(this.$scope, this.$attrs);

            this.$scope.checkboxMenuItems = [];
            this.$scope.checkboxOnChange = function(data, status) {
                self.$scope.$$dtColumnVisibilityObj.renderColumn(data.index);
            };

            this.$scope.bootstrap = function (setupOptionsFn, element, attrs) {
                return self.bootstrap(setupOptionsFn, element, attrs);
            };

            this.$scope.hideAllowed = function() {
                return !self.$attrs.hasOwnProperty('noVisibility');
            };

            this._setupActionsMenu();
            this._setupSignals();
        },

        /**
         * Set up actions menu.
         */
        _setupActionsMenu: function() {
            this.$scope.actionsMenu = false;
            if (this.$attrs.hasOwnProperty('actionsMenu')) {
                this.$scope.model = this.$attrs.model;
                this.$scope.action = this.$attrs.action;
                this.$scope.actionsTitle = this.$attrs.actionsTitle;
                this.$scope.actionsMenu = true;
                this.$scope.actionsMode = this.$attrs.actionsMode || 'create';
            }
        },

        /**
         * Set up signals to listen and/or send.
         */
        _setupSignals: function() {
            var self = this;

            // Table data has been changed and reload may be required
            var unregisterFn = this.$scope.$root.$on(Signals.tableReload.name, function(event, signalObj) {
                var reload = false;

                // Model object present in event data
                if (UtilsLib.Common.isObject(signalObj.data.model) && signalObj.data.model.modelMatch(self.$attrs.model)) {
                    reload = true;
                }

                // Model name present in event data
                else {
                    reload = (signalObj.data.model === self.$attrs.model);
                }

                // On match, reload table data
                if (reload) {
                    self.reloadTable();
                }
            });

            /*
             * Manually unregister event listener.
             * This is needed since $rootScope is never destroyed during the lifetime of the application.
             */
            this.$scope.$on('$destroy', unregisterFn);
        },

        /**
         * Interface offered by the controller to the table column directive (app-column) to
         * add column definition to table options.
         *
         * @param {Object} data Column definition attributes from <app-column> HTML element.
         */
        addColumn: function(data) {
            this.$scope.columnCollection.addColumn(data, this.appLogger);
        },

        /**
         * Interface offered by the controller to the row details directive (row-details) to
         * add row detail to table options.
         *
         * @param {Object} data Row detail attributes from <row-details> HTML element.
         */
        addRowDetail: function(data) {
            DtRowDetails.addRowDetails(this.$scope, data, this.$scope.options, this.appLogger);
        },

        /**
         * Reload table data.
         */
        reloadTable: function() {
            this.$scope.$$dataTable.ajax.reload(null, false);
        },

        /**
         * Bootstrap the datatable using specified table options.
         */
        bootstrap: function (setupOptionsFn, element, attrs) {
            // Prepare table options
            if (!this.prepareDt(setupOptionsFn, element, attrs)) {
                return;
            }

            // Create the DataTables object
            var dataTable = element.find('table').DataTable(this.$scope.options);
            this.$scope.$$dataTable = dataTable;

            // Finalize table setup
            this.finalizeDt(dataTable);

            // Setup DT plugins (note that this is using old API syntax)
            element.find('table').dataTable().fnSetFilteringDelay();
        },

        prepareDt: function(setupOptions, $element, $attrs) {
            var self = this;

            // Use column data, if present. Otherwise it is expected that options
            // are provided to scope.
            var columns = this.$scope.columnCollection.getColumns();
            if (columns.length) {
                this.$scope.options.columns = columns;
            }

            // Abort if no columns data present
            if (!this.$scope.options.columns || !this.$scope.options.columns.length) {
                return false;
            }

            // Create row details handler
            this.$scope.$$dtRowDetailsObj = new DtRowDetails({
                element: $element,
                scope: this.$scope
            });


            // Initialize table options
            setupOptions(this.$scope, $attrs);

            // Prepare column details, if any
            this.$scope.$$dtRowDetailsObj.includeRowDetails();


            // Prepare column visibility items
            var items = this.$scope.$$dtColumnVisibilityObj.getColumnTitles();
            for (var i = 0; i < items.length; i++) {
                this.$scope.checkboxMenuItems.push(items[i]);
            }


            // Initialisation complete callback, table has fully been initialised, data loaded and drawn
            this.$scope.options.initComplete = function() {
                self.$scope.$$dtOptionsObj.themeCall('initComplete', this);

                // Show the table element
                $element.find('.hidden').removeClass('hidden');

                // Hide loading indicator
                if (self.$scope.showLoader) {
                    self.$scope.sendDataLoadedSignal();
                }
            };

            // Function that is called every time DataTables performs a draw
            this.$scope.options.drawCallback = function(settings) {
                self.$scope.$$dtOptionsObj.themeCall('drawCallback', this);
            };

            return true;
        },

        finalizeDt: function(dataTable) {
            // Handle row details rendering
            this.$scope.$$dtRowDetailsObj.initRowDetails(dataTable);
        }
    });

    return {
        feature: 'controller',
        name: 'DataTablesCtrl',
        cls: ['$scope', '$element', '$attrs', 'appLogger', DataTablesCtrl]
    };
});
