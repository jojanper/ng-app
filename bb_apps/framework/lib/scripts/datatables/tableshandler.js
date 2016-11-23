define(['underscore',
        'backbone',
        'jquery',
        'datatables'],
       function(_, Backbone, $) {

           /**
            * DataTables handler for basic operations such as creating
            * and deleting the dataTables object.
            */
           var DataTablesHandler = (function() {

               // Constructor
               var DataTablesHandler = function(settings) {

                   this.settings = settings || {};

                   // Highlight class CSS definition
                   this.highlightClass = this.settings.rowClass || "datatablerowhighlight";

                   // Datatables handler
                   this.dataTable = null;

                   // DataTables API instance
                   this.dataTableAPI = null;

                   // Element ID for the datatables
                   this.dataTableID = this.settings.dataTableID;

                   this.disabledColumns = [];
               };

               // Set new class definition for highlighting the rows
               setHighlightClass = function(className) {
	           this.highlightClass = className;
               },

               // Delete datatable
               deleteTable = function() {
                   if (this.dataTable) {
	               this.dataTable.fnDestroy();
	               this.dataTable = null;
                   }

	           return this;
               },

               // Show & hide datatable
               showTable = function(visible) {
                   if ((visible == null || visible) && this.dataTable !== null) {
	               $(this.dataTableID).show();
                   }
                   else {
	               $(this.dataTableID).hide();
                   }
               },

               // Handler for enabling & disabling row highlighting
               highlightRow = function() {
                   var self = this;

	           /*
	            * Add & remove highlight class when mouse is entering and leaving the row.
	            */
	           var idEl = this.dataTableID;
	           $(idEl + ' td').bind('mouseenter', function () {
	               $(this).parent().children().each(function() {
		           $(this).addClass(self.highlightClass);
	               });
	           });
	           $(idEl + ' td').bind('mouseleave', function () {
	               $(this).parent().children().each(function() {
		           $(this).removeClass(self.highlightClass);
	               });
	           });
               },

               // Open and close details section
               openAndCloseDetails = function(oTable, nTr, fnFormatDetailsCallBack,
                                              rowIndex, refresh)
               {
                   if (refresh === true) {
                       oTable.fnClose(nTr);
                   }

	           if(oTable.fnIsOpen(nTr))
	           {
	               // This row is already open - close it
	               oTable.fnClose(nTr);
	           }
	           else
	           {
                       fnFormatDetailsCallBack(oTable, nTr, rowIndex, function(data) {
                           // Open this row
	                   oTable.fnOpen(nTr, data, 'details');
                       });
	           }
               },

               // Create dataTables
               createTable = function(disabledColumns, iSettings) {
                   if (this.dataTable != null) {
                       deleteTable.call(this);
                   }

                   this.disabledColumns = disabledColumns;
                   this.dataTableAPI = $(this.dataTableID).DataTable(iSettings);
                   this.dataTable = $(this.dataTableID).dataTable();

                   return this.dataTable;
               },

               /*
                * Add events for datatables. Currently only row details is handled
                * for each table instance.
                */
               addEvents = function(fnFormatDetails) {
                   /*
	            * Add event listener for opening and closing details. Note that the indicator for
	            * showing which row is open is not controlled by DataTables, rather it is done here.
	            */
                   var self = this;
                   var idEl = this.dataTableID;
                   $(document).off('click', idEl + ' tbody td');
	           $(document).on('click', idEl + ' tbody td', function() {
                       openAndCloseDetailsEntry.call(self, fnFormatDetails, this, false);
                   });
               },

               // Handler for row details
               openAndCloseDetailsEntry = function(fnFormatDetails, td, refresh) {
                   try {
	               // Get the position of the current data from the node
	               var aPos = this.dataTable.fnGetPosition(td);

                       // Check if (clicked) column is not disabled
                       var openRow = true;
                       for (i = 0; i < this.disabledColumns.length; i++) {
                           if (aPos[2] == this.disabledColumns[i]) {
                               openRow = false;
                               break;
                           }
                       }

                       // Open details for corresponding row
                       if (openRow) {
		           var nTr = $(td).parents('tr')[0];
                           openAndCloseDetails.call(this, this.dataTable, nTr,
                                                    fnFormatDetails, aPos[0],
                                                    refresh);
	               }
                   }
                   catch(error) {
                   }
               };

               // Prototype(s)
               DataTablesHandler.prototype = {
                   constructor: DataTablesHandler,
                   highlightRow: highlightRow,
                   showTable: showTable,
                   deleteTable: deleteTable,
                   createTable: createTable,
                   addEvents: addEvents,
                   rowDetails: openAndCloseDetailsEntry,
                   tableHandle: function() {
                       return this.dataTable;
                   }
               };

               // return module
               return DataTablesHandler;

           })();

           return DataTablesHandler;
});
