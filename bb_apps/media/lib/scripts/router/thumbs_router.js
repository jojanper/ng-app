define(["jquery",
        "underscore",
        "framework",
        "backbone",
        "backbone.localStorage",
        "backbone.subroute"],
function($, _, AppLib, Backbone) {

    $.fn.appHandler = function(appObj) {
	return this.each(function(i, el) {
	    var base = el;

            $(base).on({

                /*
                 * Search overview thumbnails (render only those media that
                 * match the search keyword).
                 */
                searchThumbs: function(e, data) {
                    appObj.appView.searchMedia(data.searchKeyword);
                }
            });
        });
    };

    function ThumbApps(options) {

        this.el = '#appview';
        this.options = options;
        this.appView = null;
        this.appEventHandler = null;

        this._initialize = function() {
            /*
             * Event handler for thumbnail events.
             */
            this.appEventHandler = $(this.el).appHandler(this);

            /*
            $(this.el).on({
                searchThumbs: function(e, data) {
                    console.log(data.searchKeyword);
                }
            });
            */
        };

        this.createView = function(callback) {

            /*
             * View exists already, no need to create it.
             */
            if (this.appView) {
                callback(this.appView);
                return false;
            }

            this._initialize();

            /*
             * Create main application layout for the thumbnails.
             */
            this.appView = new this.options.mediaLib.Views.ThumbAppView({
                eventHandler: this.appEventHandler,
                config: this.options.config,
                appContext: this.options.appContext
            }).render();

            callback(this.appView);

            return true;
        };

        this.closeView = function() {
            this.appView.close();
            this.appView = null;
        };
    };

    return AppLib.BaseSubRouter.extend({

        routes: {
            "": "mediaThumbSummary",
            ":id": "thumbDetails",
            '*actions': 'defaultRoute'
        },

        subRouterInitialize: function() {
            this.appHandler = new ThumbApps(this.options);
        },

        _executeView: function(id) {
            var self = this;
            this.options.router.navigateTo(this.prefix, this, {
                'callback': function() {
                    self.appHandler.createView(function(appView) {
                        if (appView) { appView.setMedia(id); }
                    });
                }
            });
        },

        mediaThumbSummary: function() {
            this._executeView(null);
        },

        thumbDetails: function(id) {
            this._executeView(id);
        }

    }, {_id: 'ThumbsRouter'});
});
