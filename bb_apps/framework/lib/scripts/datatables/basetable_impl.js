define(['underscore',
        'backbone',
        './tablesettings',
        'jquery',
        'datatables',
        './fnSetFilteringDelay'],
       function(_, Backbone, AppDataTables, $) {

           /*
            * BaseTable
            *   DataTablesHandler
            *     DataTablesSettingsHandler
            *     DataTablesActionsHandler
            */

           return Backbone.View.extend({

               initialize: function(options) {
                   this.options = options || {};

                   // Highlight class CSS definition
                   this.highlightClass = this.options.highlightClass || "datatablerowhighlight";

                   // DataTables object handler
                   this.tblHandler = new AppDataTables({
                       dataTableID: this.options.tableID
                   });
               },

               /**
                * Create table as DataTables.
                */
               createTable: function(createOptions) {
                   var options = createOptions;
                   if (options === undefined) { options = {}; }

                   /*
                   var callbacks = options.callbacks || {};
                   var disabledColumns = options.disabledColumns || '';
                   var settings = options.settings || {};
                   var plugins = options.plugins || {};
                   var modeSettings = options.modeSettings || {};

                   console.log(callbacks);
                   console.log(settings);
                   */

                   var table = this.tblHandler.createTable(options);
                   /*
                   if (plugins.setFilteringDelay == true) {
                       table = table.fnSetFilteringDelay();
                   }
                   */
               },

               render: function() {
                   return this;
               }

           }, {_id: 'BaseTable'});
});
