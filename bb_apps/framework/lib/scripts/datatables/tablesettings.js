define(['underscore',
        'backbone',
        '../draal',
        './tableshandler',
        'jquery',
        'datatables'],
       function(_, Backbone, DraalLib, DataTablesBaseHandler, $) {

           var tableSettings = {

               /**
                * Default settings.
                */
               "default": {
                   "destroy": true,
                   "paging": true,
                   "jQueryUI": true,
                   "processing": true,
                   "pagingType": "full_numbers",
                   "autoWidth": false,
                   "dom": '<"H"lfrp>t<"F"ip>',

                   /**
                    * The language information presented by DataTables can be completely altered
                    * for internationalisation (or localisation) using the properties of the
                    * oLanguage object. Note that all strings in the following may contain HTML
                    * tags (i.e. you can include images etc. if you so wish in them).
                    */
                   "language": {
                       /**
                        * This string gives information to the end user about the information
                        * that is current on display on the page. The START, END and TOTAL
                        * variables are all dynamically replaced as the table display
                        * updates, and can be freely moved or removed as the language
                        * requirements change.
                        */
                       "info": "Got a total of _TOTAL_ entries to show (_START_ to _END_)",

                       /**
                        * When a user filters the information in a table, this string is
                        * appended to the information (sInfo) to give an idea of how strong
                        * the filtering is. The variable MAX is dynamically updated.
                        */
                       "infoFiltered": "(filtered from _MAX_ total entries)",
                   },

                   /**
                    * The information element can be used to convey information about the current
                    * state of the table. Although the internationalisation options presented by
                    * DataTables are quite capable of dealing with most customisations, there may
                    * be times where you wish to customise the string further. This callback
                    * allows you to do exactly that.
                    */
                   "infoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                       var o = this.DataTable().page.info();

                       // Previous page number
                       self.iPagePrev = self.iPage;

                       // Current page number
                       self.iPage = o.page;

                       // Display text
                       var sOut =  $.sprintf('Showing %s to %s of %s entries',
                                             o.start, o.end, o.recordsDisplay);
                       if (o.iTotal != o.recordsDisplay) {
                           sOut += $.sprintf(' (filtered from %s total entries)', o.recordsTotal);
                       }
                       return sOut;
                   },
               },

               /**
                * Settings for server side processing.
                */
               "serverSide": {
                   "serverSide": true,
                   "lengthChange": false,
                   "pageLength": 5
               },

               /**
                * Settings for headerless DataTables.
                */
               "headerless": {
                   "processing": true,
                   "jQueryUI": false,
                   "dom": 'rtp',
               }
           };

           var tablePlugins = {
               'setFilteringDelay': 'fnSetFilteringDelay'
           };

           /**
            * Settings handler for DataTables. This handler can be used to
            * create datatables for any data presentation.
            */
           var TableSettingsHandler = (function () {

               // Constructor
               var TableSettingsHandler = function(settings) {
                   this.settings = settings || {};

                   this.iPage = 0;
                   this.iPagePrev = 0;
                   this.tablesHandler = new DataTablesBaseHandler(this.settings);
               };

               // Create dataTables with specified settings
               var createTable = function(options) {
                   var self = this;

                   var callbacks = options.callbacks || {};
                   var disabledColumns = options.disabledColumns || '';
                   var settings = options.settings || {};
                   var plugins = options.plugins || {};
                   var modeSettings = options.modeSettings || {};

                   if (this.tablesHandler != null) {
                       var tblSettings = $.extend({}, tableSettings.default, {

                           /**
                            * This function is called on every 'draw' event, and allows to
                            * dynamically modify any aspect you want about the created DOM.
                            */
                           'drawCallback': function() {
                               if (callbacks.hasOwnProperty('customDrawCallback')) {
                                   callbacks['customDrawCallback'](this);
                               }

                               self.tablesHandler.highlightRow();
                           },

                           /**
                            * Called when the table has been initialised. Normally DataTables will
                            * initialise sequentially and there will be no need for this function,
                            * however, this does not hold true when using external language information
                            * since that is obtained using an async XHR call.
                            */
                           'initComplete': function() {
                               if (this.fnGetNodes().length > 0) {
                                   if (callbacks.hasOwnProperty('addEvents')) {
                                       var instance = null;
                                       if (callbacks.hasOwnProperty('eventsInstance')) {
                                           instance = callbacks['eventsInstance'];
                                       }

                                       callbacks['addEvents'](this, instance);
                                   }

                                   if (callbacks.hasOwnProperty('formatDetails')) {
                                       self.tablesHandler.add_events(callbacks['formatDetails']);
                                   }

                                   if (callbacks.hasOwnProperty('genericCallback')) {
                                       callbacks['genericCallback'](this, callbacks);
                                   }
                               }

                               // Callback when finished loading the datatable
                               if (callbacks.hasOwnProperty('dataTablesComplete')) {
                                   callbacks['dataTablesComplete'](this.fnGetNodes().length, this);
                               }
                           }
                       });

                       /*
                        * Include various DataTables mode settings.
                        */
                       for (var key in modeSettings) {
                           if (key) {
                               if (modeSettings[key] === true) {
                                   if (tableSettings.hasOwnProperty(key)) {
                                       tblSettings = $.extend(tblSettings, tableSettings[key]);
                                   }
                               }
                           }
                       }

                       tblSettings = $.extend(tblSettings, settings);

                       this.tablesHandler.deleteTable();
                       this.tablesHandler.createTable(disabledColumns, tblSettings);

                       var table = this.tableHandle();
                       for (var key in plugins) {
                           if (key) {
                               if (plugins[key] === true) {
                                   if (tablePlugins.hasOwnProperty(key)) {
                                       table = table[tablePlugins[key]]();
                                   }
                               }
                           }
                       }
	           }

                   return this.tableHandle();
               };

               TableSettingsHandler.prototype = {
                   constructor: TableSettingsHandler,
                   createTable: createTable,

                   dataTables: function() {
                       return this.tablesHandler;
                   },

                   tableHandle: function() {
                       return this.tablesHandler.tableHandle();
                   },

                   pageNumber: function(pageMode) {
                       if (pageMode === undefined || pageMode === 'previous') {
                           return this.iPagePrev;
                       }

                       // Current page number
                       return this.iPage;
                   },

                   currPage: function() {
                       return this.iPage;
                   },

                   deleteTable: function() {
                       this.tablesHandler.deleteTable();
                   },
               };

               return TableSettingsHandler;

           }) ();

           return TableSettingsHandler;
});
