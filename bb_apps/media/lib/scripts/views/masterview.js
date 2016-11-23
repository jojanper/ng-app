define(['jquery',
        'underscore',
        'backbone',
        'framework',
        '../views/mediaview',
        '../models',
        'framework'],
function($, _, Backbone, AppLib, MediaView, Models, AppLib) {

    var Views = AppLib.ObjWrapper.convert([MediaView]);

    // Subview definitions
    var subView = {
        thumbSummary: {
            view: Views.MediaViewList,
            collection: Models.MediaCollection
        }
    };

    return AppLib.BaseView.extend({

        // Parent container
        el: "#appview",

        // Search element
        searchEl: "#thumb_search",

        events: {
            "click #reload_thumbs": "reloadThumbs"
        },

        initialize: function(options) {
            _.bindAll(this, "reloadThumbs");
            this.options = options || {};

            this.subViews = {};
            this.selectedMedia = null;
            this.mediaUrl = this.options.config['urls']['video_api'];
            this.thumbsHome = Backbone.Router.reverse('mediaThumbSummary', {'withoutPrefix': true});
        },

        createSubviews: function() {
            var viewObj = subView.thumbSummary;
            this.subViews['thumbs'] = new viewObj.view({
                collection: new viewObj.collection({
                    url: this.mediaUrl
                }),
                eventHandler: this.options.eventHandler,
                config: this.options.config,
                appContext: this.options.appContext
            });
        },

        reloadThumbs: function(e) {
            AppLib.CollectionManager.deleteCollection();

            if(e) {
                this.selectedMedia = null;
                app.navigate(this.thumbsHome, {trigger: true, replace: true});
            }

            this.clearSubviews({thumbs: true});
            this.createSubviews();
            if(this.selectedMedia)
                this.subViews.thumbs.setMedia(this.selectedMedia);
        },

        searchMedia: function(searchKeyword) {
            if(this.subViews.thumbs) {
                this.subViews.thumbs.searchMedia(searchKeyword);
            }
        },

        setMedia: function(id) {
            this.selectedMedia = id;
            if(this.subViews.thumbs) {
                var obj = this.subViews.thumbs;
                obj.setMedia(this.selectedMedia, function() {
                    obj.render();
                });
            }
        },

        /**
         * Render the initial view for thumbnail browsing. The time-indexed
         * thumbnail content rendering is outside the scope of this view.
         */
        render: function() {
            var self = this;

            AppLib.TemplateManager.get('thumbnails/appview', function(template) {

                self.$el.html(template);

                /*
                 * User typed something to the search box; this will now
                 * trigger an event so that listeners can react to it.
                 */
                self.$("input").lazySearch(function() {
                    var searchData = self.$(self.searchEl).val().toLowerCase();
                    self.options.eventHandler
                        .trigger('searchThumbs', [{searchKeyword: searchData}]);
                });

                /*
                 * Load (and show) the summary thumbs.
                 */
                self.reloadThumbs();
            });

            return this;
        }

    }, {_id: 'ThumbAppView'});
});
