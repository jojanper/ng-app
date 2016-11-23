/**
 * Controller for DataTables.
 */
define([
    './basecontroller'
], function (BaseCtrl) {
    "use strict";

    var DropDownCtrl = BaseCtrl.extend({

        initialize: function() {
            var self = this;

            this.$scope.status = {
                isopen: false
            };

            /*
             * You can either use is-open to toggle or add inside a
             * <a dropdown-toggle> element to toggle it when is clicked.
             */
            this.$scope.toggled = function(open) {
            };

            /*
             * There is also the on-toggle(open) optional expression fired
             * when dropdown changes state.
             */
            this.$scope.toggleDropdown = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                self.$scope.status.isopen = !self.$scope.status.isopen;
            };

            // Menu item clicked, call the callback function
            this.$scope.callback = function(item, status) {

                // Set up checked status
                self.$scope.menuItems.forEach(function(menuItem) {
                    menuItem.$$checked = false;
                });
                item.$$checked = true;

                if (item.callback) {
                    item.callback(item.callbackArgs, status);
                }
            };

            // Close menu
            this.$scope.closeMenu = function() {
                self.$scope.status.isopen = false;
            };
        }
    });

    return {
        feature: 'controller',
        name: 'DropDownCtrl',
        cls: ['$scope', '$element', '$attrs', DropDownCtrl]
    };
});
