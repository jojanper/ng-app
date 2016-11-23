define(['underscore',
        'backbone',
        '../datatables/basetable',
        '../base/baseview',
        'jquery',
        'datatables'],
function(_, Backbone, DataTables, BaseView, $) {

    /**
     * Site news view
     */
    return BaseView.extend({

        // Parent container
        el: "#newsview",

        // DataTables ID
        tableEl: '#newsTable',

        // View template
        template: '<div class="container-wrapper draal_datatable">' +
            '<table id="newsTable" class="display white-background-rows hidden">' +
            '</table></div>',

        // Column specific initialisation properties
        columns: [
            {
                "data": "name",
                "title": 'Name',
                "width": "80%"
            },
            {
                "data": "duration",
                "title": 'Duration',
                "width": "20%"
            }
        ],

        initialize: function(options) {
            this.options = options || {};
            this.table = new DataTables({tableID: this.tableEl});
            this.render();
        },

        _renderTable: function() {
            var self = this;

            this.table.createTable({
                callbacks: {
                    "genericCallback": function(table) {
                        $(self.tableEl + ' thead').hide();
                        $(self.tableEl).removeClass('hidden');
                    },
                    "dataTablesComplete2": function(nRows, table) {
                        console.log("dataTables_complete");
                        console.log(nRows);
                        console.log(table);
                    },
                    "customDrawCallback": function(table) {
                        $(self.tableEl)
                            .parent()
                            .find('.dataTables_paginate')
                            .find('.ui-state-default')
                            .removeClass('ui-state-default');
                    },
                },
                disabledColumns: '',
                settings: {
                    "ajax": "/api/media",
                    "ajax2": {
                        "url": "/api/media",
                        "dataSrc": ""
                    },
                    "columns": this.columns
                },
                plugins: {
                    'setFilteringDelay': true
                },
                modeSettings: {
                    "serverSide": true,
                    "headerless": true
                }
            });
        },

        render: function() {
            this.$el.html(this.template);
            this._renderTable();
            return this;
        }

    }, {_id: 'SiteNews'});
});
