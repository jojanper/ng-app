define(['underscore',
        '../base/baseview',
        'jquery',
        'jQuery.contextMenu'],
function(_, BaseView, $) {

    /**
     * Context menu.
     */
    return BaseView.extend({

        initialize: function(options) {
            var _options = options || {};
            this.selector = _options.selector || 'body';
            this.menuHandle = null;
        },

        createMenu: function(menuItemsCallback, context) {
            this.menuHandle = $.contextMenu({
                selector: this.selector,
                autoHide: true,
                build: function($trigger, e) {
                    // This callback is executed every time the menu is to be shown;
                    // its results are destroyed every time the menu is hidden;
                    // e is the original contextmenu event, containing e.pageX and e.pageY
                    // (amongst other data)
                    return {
                        items: menuItemsCallback.call(context, $trigger, e)
                    };
                }
            });
        },

    }, {_id: 'ContextMenu'});

});
