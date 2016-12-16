/**
 * @fileOverview
 * Column visibility for DataTables.
 */
define([
    'jquery',
    'common/toolbox'
], function($, Toolbox) {

    var DataTablesColumnVisibility = Toolbox.BaseClass.extend({

        /**
         * Create object for DataTables column visibility handler.
         *
         * @public
         * @class DataTablesColumnVisibility
         *
         * @param {Object} $scope Scope object
         * @param {Object} $sttrs Column attributes
         */
        constructor: function($scope, $attrs) {
            this.$scope = $scope;
            this.$attrs = $attrs;
        },

        /**
         * Return true if column visibility change is enabled, false otherwise.
         *
         * @public
         * @instance
         * @memberOf DataTablesColumnVisibility
         */
        visibilityEnabled: function() {
            return !this.$attrs.hasOwnProperty('noColumnHide');
        },

        /**
         * Render column visibility (hide or show column).
         *
         * @public
         * @instance
         * @memberOf DataTablesColumnVisibility
         *
         * @param {integer} columnIndex Column index.
         */
        renderColumn: function(columnIndex) {
            if (this.visibilityEnabled()) {
                var column = this.$scope.$$dataTable.column(columnIndex);
                if (column) {
                    column.visible(!column.visible());
                }
            }
        },

        /**
         * Determine column titles.
         *
         * @public
         * @instance
         * @memberOf DataTablesColumnVisibility
         *
         * @param {Array} Table column titles
         * @return {Array} Column titles
         */
        getColumnTitles: function() {
            var titles = [];
            if (this.visibilityEnabled()) {
                for (var i = 0; i < this.$scope.options.columns.length; i++) {
                    titles.push(this.$scope.options.columns[i].title || 'No title');
                }
            }

            return titles;
        }
    });

    return DataTablesColumnVisibility;
});
