define(['text!./templates/dropdown.html'], function (DropdownTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name menuDropdown
     * @restrict E
     *
     * @description
     * Component for showing dropdown menu with clickable actions and/or links. The underlying implementation
     * uses Dropdown component from UI Bootstrap, see https://angular-ui.github.io/bootstrap/#/dropdown.
     *
     * @param {string} menuItems Menu items (array of objects) to show as assignable angular expression.
     *
     *   * `callback` and `link` properties should not be both present in the object.
     *   * `divider` is a standalone definition, that is, object should not contain any other properties.
     *
     * @param {function} menuItems.callback Callback function for menu click.
     * @param {string} menuItems.text Text for menu item.
     * @param {string} menuItems.link Link (href) attribute for the menu item.
     * @param {boolean} menuItems.divider Menu item is a divider.
     *
     * @param {string=} dynTitle Menu title as assignable angular expression.
     * @param {string=} [title=Select] Menu title. `dynTitle` parameter has precedence over `title` parameter.
     * @param {string=} [noTitle=''] Disable menu title from component.
     * @param {string=} noCheckStatus Disable checked status from selected menu item.
     * @param {string=} [type=default] Menu type. Supported types:
     *
     *   * default: Show menu items as list, item selection will close the menu.
     *   * checkbox: Show menu items as checkboxes, menu need to be closed manually.
     *
     * @param {string=} [dropdownElement=button] Layout type of the menu. Supported types:
     *
     *   * button: Show menu element as button.
     *   * transparent: Show menu as transparent component.
     *
     * @param {string=} [autoClose=disabled] Menu closing behaviour. Supported types:
     *
     *   * always
     *   * disabled
     *   * outsideClick.
     *
     * See https://angular-ui.github.io/bootstrap/#/dropdown for more details.
     *
     * @param {string=} [tooltipText=''] Tooltip text for the menu.
     *
     * @example
       <example>
         <file name="index.html">
           <menu-dropdown tooltip-text="Select item" dropdown-element="transparent" dyn-title="subAppsMenuTitle"
                          auto-close="always" menu-items="menuItems"></menu-dropdown>
         </file>
       </example>
     */
    var MenuDropdown = function () {
        return {
            scope: {
                menuItems: "=",
                dynTitle: "@"
            },
            restrict: 'E',
            template: DropdownTemplate,
            controller: 'DropDownCtrl',
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.title = $attrs.title || 'Select';
                    $scope.type = $attrs.type || 'default';
                    $scope.autoClose = $attrs.autoClose || 'disabled';
                    $scope.dropdownElement = $attrs.dropdownElement || 'button';
                    $scope.tooltipText = $attrs.tooltipText || '';
                    $scope.noTitle = $attrs.hasOwnProperty('noTitle') ? true : false;
                    $scope.noCheckStatus = $attrs.hasOwnProperty('noCheckStatus') ? true : false;
                });
            }
        };
    };

    /**
     * @ngdoc directive
     * @name tableDataItemActions
     * @restrict E
     *
     * @description
     * Component for showing actions as dropdown menu for model item in a table column. Assumes that
     * the `'dtTable'` parameter is Datables object.
     *
     * @param {string} dtTable DataTables object as assignable angular expression.
     * @param {string} id Model ID for which to show the actions.
     * @param {string} model Model name.
     *
     * @example
       <example>
         <file name="index.html">
           '<table-data-item-actions id="1" dt-table="$$dataTable"></table-data-item-actions>'
         </file>
       </example>
     */
    var TableDataItemActions = function (rest) {
        return {
            scope: {
                dtTable: '='
            },
            restrict: 'E',
            template: '<menu-dropdown no-title dropdown-element="transparent" auto-close="always" ' +
                'menu-items="actionItems"></menu-dropdown>',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                $scope.actionItems = [];

                $scope.initialize = function() {
                    var dataId = parseInt($attrs.id);

                    // TODO: Possibly move to another module to generalize implementation and to enable
                    // also usage for other than table row based actions.
                    var data = $scope.dtTable.data();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id === dataId) {
                            for (var action in data[i].actions) {
                                if (action) {
                                    (function(item) {
                                        if (item.method === 'POST') {
                                            $scope.actionItems.push({
                                                callback: function() {
                                                    rest.submitData(null, item.url, $scope, $attrs.model, true);
                                                },
                                                /*jshint camelcase: false */
                                                text: item.display_name
                                                /*jshint camelcase: true */
                                            });
                                        }
                                        else {
                                            $scope.actionItems.push({
                                                link: item.url,
                                                /*jshint camelcase: false */
                                                text: item.display_name
                                                /*jshint camelcase: true */
                                            });
                                        }

                                    }) (data[i].actions[action]);
                                }
                            }
                            break;
                        }
                    }
                };
            }],
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    $scope.initialize();
                });
            }
        };
    };

    return [
        {
            feature: 'directive',
            name: 'menuDropdown',
            cls: MenuDropdown
        },
        {
            feature: 'directive',
            name: 'tableDataItemActions',
            cls: ['rest', TableDataItemActions]
        }
    ];
});
