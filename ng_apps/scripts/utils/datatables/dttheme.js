/**
 * @fileOverview
 * Theme builder for DataTables.
 */
define([
    'angular',
    'jquery',
    'common/toolbox'
], function(angular, $, Toolbox) {

    var themes = {
        /**
         * Default theme.
         */
        default: {
            themeClass: 'box-shadow draal_datatable'
        },

        /**
         * Bootstrap theme.
         */
        bootstrap: {
            initComplete: function(dtTable) {
                $(dtTable).removeClass('display').addClass('table table-hover table-striped table-bordered');
            },
            drawCallback: function(dtTable) {
                $(dtTable).parent().parent().parent()
                    .find('.dataTables_paginate')
                    .find('.ui-state-default')
                    .removeClass('ui-state-default');
            },
            themeClass: 'bootstrap-dt-table box-shadow draal_datatable'
        },

        /**
         * Bootstrap simple theme.
         */
        'bootstrap-simple': {
            initComplete: function(dtTable) {
                $(dtTable).removeClass('display').addClass('table table-hover table-striped table-bordered');
            },
            drawCallback: function(dtTable) {
                $(dtTable).parent().parent().parent()
                    .find('.dataTables_paginate')
                    .find('.ui-state-default')
                    .removeClass('ui-state-default');
            },
            themeClass: 'bootstrap-dt-table-simple draal_datatable'
        },

        /**
         * Fixed theme, no header or footer (pagination) present.
         */
        fixed: {
            options: {
                "dom": 'rtip'
            },
            initComplete: function(dtTable) {
                $(dtTable).find('thead').hide();
            },
            drawCallback: function(dtTable) {
                $(dtTable).parent()
                    .find('.dataTables_paginate')
                    .find('.ui-state-default')
                    .removeClass('ui-state-default');
            },
            themeClass: 'fixed-dt-table box-shadow draal_datatable'
        }
    };

    var DataTablesThemeBuilder = Toolbox.BaseClass.extend({

        /**
         * Theme builder for DataTables. Provides interface for managing the theme throughout
         * the lifecycle of the table. Currently focuses mostly on the table layout management.
         *
         * @public
         * @class DataTablesThemeBuilder
         *
         * @param {Object=} options Theme options.
         */
        constructor: function(options) {
            this.options = options || {};
            this.theme = this.options.theme || 'default';
        },

        /**
         * Execute theme method.
         *
         * @public
         * @instance
         * @memberOf DataTablesThemeBuilder
         *
         * @param {string} method Method to execute. Currently supported methods:
         * <br/>
         * <br/>initComplete: Called when DataTables has been fully initialized.
         * <br/>drawcallback: Called every time DataTables performs a draw.
         * <br/>themeClass: CSS classes for table HTML template. The CSSs are wrapped around the table HTML code.
         *
         * @return {string|undefined} Result of operation.
         */
        themeCall: function(method, dtTable) {
            if (this.theme) {
                if (themes[this.theme] && themes[this.theme][method]) {
                    var fn = themes[this.theme][method];
                    if (angular.isFunction(fn)) {
                        return fn(dtTable);
                    }
                    else {
                        return fn;
                    }
                }
            }

            return '';
        }
    });

    return DataTablesThemeBuilder;
});
