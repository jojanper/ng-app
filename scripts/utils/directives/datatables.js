define([
    'angular',
    'jquery',
    'utils/datatables/dtoptions',
    'text!./templates/datatables.html'
], function (angular, $, DtOptions, TablesTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name appTable
     * @restrict E
     *
     * @description
     * Table component using DataTables (https://datatables.net/) for showing table data. See also
     * the table column component definition {@link appColumn appColumn}.
     *
     * @param {scope|string} options Table options as assignable angular expression.
     * @param {string=} dtServerSide If set to true, server side processing is enabled for table.
     * @param {string=} noColumnHide If present, user is not offered a possibility to hide table columns.
     * @param {string=} noVisibility If present, use is not offered a possibility to hide the table.
     * @param {string=} noSpinner If present, loading indicator is not shown during initial data loading.
     * @param {string=} baseUrl Endpoint URL for data fetching.
     * @param {string=} model Name of model the data represents. If present, `baseUrl` attribute is ignored.
     * @param {string=} modelId Model ID. Needed only if URL resolver needs ID.
     * @param {string=} [urlResolver=listingUrl] URL resolving name for data endpoint URL.
     * Used only when `model` attribute is present.
     *
     * @param {string=} actionsMenu If specified, includes actions menu to table layout.
     * @param {string=} action Name of action. See {@link actionsMenu actionsMenu}.
     * @param {string=} actionsTitle Title for the action menu. See {@link actionsMenu actionsMenu}.
     */
    var AppTable = function ($compile, network, appUrlResolver) {

        function commonOptions($scope, baseUrl) {
            return {
                // Compile row HTML code that that angular can handle it, if needed
                "createdRow": function(nRow, aData, iDataIndex) {
                    $compile(nRow)($scope);
                },

                // Load data for the table's content from an Ajax source
                "ajax": function (data, callback, settings) {
                    var url = baseUrl + '?' + $.param(data);
                    network.get(url).then(function(data) {
                        callback(data);
                    });
                }
            };
        }

        function setupOptions($scope, $attrs) {
            angular.extend($scope.options, commonOptions($scope, $scope.options.baseUrl || $attrs.baseUrl));
            $scope.$$dtOptionsObj = new DtOptions($scope.options);
            $scope.options = $scope.$$dtOptionsObj.initDtOptions($attrs, $scope);
        }

        return {
            restrict: 'E',
            controller: 'DataTablesCtrl',
            link: function (scope, element, attrs) {
                scope.$evalAsync(function() {
                    scope.showLoader = !attrs.hasOwnProperty('noSpinner');

                    // Resolve the model data listing URL from model attribute
                    if (attrs.model) {
                        var urlResolver = attrs.urlResolver || 'listingUrl';
                        appUrlResolver[urlResolver](attrs.model, attrs.modelId).then(function(dataObj) {
                            attrs.baseUrl = dataObj.url;
                            scope.bootstrap(setupOptions, element, attrs);
                        });
                    }

                    // Model listing URL specified, go ahead with table bootstrapping
                    else {
                        scope.bootstrap(setupOptions, element, attrs);
                    }
                });
            },
            scope: {
                options: "=?"
            },
            transclude: true,
            template: TablesTemplate
        };
    };

    /**
     * @ngdoc directive
     * @name appColumn
     * @restrict E
     *
     * @description
     * Table column component for {@link appTable appTable}. The field reference in the parameter details
     * refers to the data source for the column. The data source is expected to contains data as key-value
     * pairs. It should also be noted that only a subset of the parameters can be specified for a column, it is
     * not possible, for example, to combine renderAppLink and renderMediaType parameters for the same column
     * definition.
     *
     * In general, it should be possible to use as parameters most of the options defined for DataTables columns
     * (see https://datatables.net/reference/option/ - click "DataTables - Columns" button).
     *
     * @param {string=} title Title for the column, default is empty string
     * (see https://datatables.net/reference/option/columns.title).
     * @param {string=} class CSS class name assign to each cell in the column, default is center (see
     * https://datatables.net/reference/option/columns.className)
     * @param {string=} width Column width assignment (see https://datatables.net/reference/option/columns.width).
     *
     * @param {string=} renderAppLink Column is a link and link name is using this parameter value as field reference.
     * This parameter requires that also `linkName` and `linkId` parameters are specified.
     * @param {string=} linkName URL router name for the link.
     * @param {string=} linkId ID for URL router.
     *
     * @param {string=} render Name of render callback in parent scope. Used to render the column data for use in the table.
     *
     * @param {string=} renderMediaType The parameter value is used as field reference for rendering column as media
     * type image. Supported media types currently:
     *
     *   * audio: Render data source item audio icon
     *   * image: Render data source item image icon
     *   * video: Render data source item video icon
     *
     * @param {string=} renderLastModified If true, the data source item with key 'last_modified' is rendered as
     * readable timestamp (e.g., "2 minutes ago").
     *
     * @example
       <example>
         <file name="index.html">
           <app-table>
             <app-column title="Playlist" render-app-link="name" link-name="playlists.edit" link-id="id">
           </app-table>
         </file>
       </example>
     */
    var AppColumn = function () {
        return {
            require: '^appTable',
            link: function ($scope, $element, $attrs, controller) {
                $scope.$evalAsync(function() {
                    controller.addColumn($attrs);
                });
            }
        };
    };

    /**
     * @ngdoc directive
     * @name rowDetails
     * @restrict E
     *
     * @description
     * Table row detail component for {@link appTable appTable}. Implements ability to show and hide child
     * rows which are attached to a parent row in the host table. This is often used to show additional
     * information about a row, particularly when you wish to convey more information about a row than
     * there is space for in the host table. The column order equals to the order they appear in the
     * HTML template under <app-table> element.
     *
     * For more information about row details, see https://datatables.net/examples/server_side/row_details.html
     *
     * @param {string=} title Title for the details column, default is 'No title'.
     * @param {string} render Details rendering callback as assignable angular expression.
     *
     * @example
       <example>
         <file name="index.html">
           <app-table>
             <row-details title="Row details" render="render"></row-details>
             <app-column title="Name" data="name"></app-column>
           </app-table>
         </file>
       </example>
     */
    var RowDetails = function () {
        return {
            require: '^appTable',
            link: function ($scope, $element, $attrs, controller) {
                $scope.$evalAsync(function() {
                    controller.addRowDetail($attrs);
                });
            }
        };
    };

    return [
        {
            // All directives are placed under this name
            componentName: 'apptable',

            feature: 'directive',
            name: 'appTable',
            cls: ['$compile', 'network', 'appUrlResolver', AppTable]
        },
        {
            feature: 'directive',
            name: 'appColumn',
            cls: AppColumn
        },
        {
            feature: 'directive',
            name: 'rowDetails',
            cls: RowDetails
        }
    ];
});
