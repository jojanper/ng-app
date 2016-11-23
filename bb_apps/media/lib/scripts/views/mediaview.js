define(['jquery',
        'underscore',
        'backbone',
        'text!./templates/medialist.html',
        './thumbview',
        '../models/thumbnail',
        'framework'],
function($, _, Backbone, thumbTemplate,
         ThumbDetailsView, ThumbModels, AppLib) {

    var Views = AppLib.ObjWrapper.convert([ThumbDetailsView]);
    var Models = AppLib.ObjWrapper.convert([ThumbModels]);

    // Subview definitions
    var subView = {
        thumbDetails: {
            view: Views.ThumbViewList,
            collection: Models.Thumbnails
        }
    };

    return AppLib.BaseView.extend({

        el: '#thumb-list',

        events: {
        },

        initialize: function(options) {
            var self = this;

            _.bindAll(this, "render");
            this.options = options || {};

            // ULR prefix to load time-indexed thumbnails
            this.urlPrefix = this.options.config['urls']['thumbs_api']

            this.selectedMedia = null;

            // Render view when collection is reset or media selected/filtered
            var events = "reset media:filtered";
            this.listenTo(this.collection, events, function() {
                self.render();
            });

            // Fire the fetch with the reset option
            this.collection.fetch({reset: true});

            // Subview for time-indexed thumbs
            this.subViews = {};

            this.menuObj = new AppLib.ContextMenu({selector: '.thumbnail-reference-image'});
        },

        setMedia: function(id, callback) {
            var status = this.collection.select(id);
            this.selectedMedia = id;

            /*
             * Specified media ID could not set since it is not
             * yet available (to be read from server etc). Wait
             * until it is available and then assign the selected
             * media.
             */
            if (!status) {
                var self = this;
                this.listenToOnce(this.collection, "reset", function() {
                    self.collection.select(id);

                    if($.isFunction(callback)) { callback(); }
                    else { self.render(); }
                });
            }
            else {
                if($.isFunction(callback)) { callback(); }
            }
        },

        searchMedia: function(searchKeyword) {
            this.collection.search(searchKeyword);
        },

        thumbsUrl: function() {
            if (this.selectedMedia && this.collection.selectedModelId) {
                return Backbone.Router.urlHelper(this.urlPrefix, {
                    id: this.collection.selectedModelId
                });
            }

            return null;
        },

        /*
         * Render the time-indexed thumbnails in separate subview.
         */
        renderThumbSubview: function() {
            this.clearSubviews();
            this.subViews['thumbDetailsView'] = new subView.thumbDetails.view({
                collection_obj: subView.thumbDetails.collection,
                collection_id: this.thumbsUrl(),
                eventHandler: this.options.eventHandler,
                appContext: this.options.appContext
            }).render();
        },

        _createMenuItems: function($trigger, e) {
            var self = this;
            var menuItems = {};

            var item = {};
            item['name'] = 'Media details';
            item['callback'] = function(key, options) {
                console.log('clicked menu');
                var id = $(e.currentTarget).data("id");
                console.log(id);

                var model = self.collection.get(id);
                //console.log(model.url());
                console.log(model);

                new AppLib.Dialog().launchDialog({
                    message: 'Test',
                    title: 'This is a test'
                }, {
                    'Save': {},
                    'Cancel': {}
                });
            };
            menuItems['details'] = item;

            return menuItems;
        },

        /**
         * Render thumbnail for all media. Each media may have multiple
         * time indexed thumbnails and only one thumbnail is shown for
         * each media.
         */
        render: function(searchKeyword) {
            var $el = $(this.el);
            var compiled_template = _.template(thumbTemplate);

            var collection = this.collection.visible();
            var html = compiled_template({results: collection});
            $el.html(html);

            this.renderThumbSubview();
            this.menuObj.createMenu(this._createMenuItems, this);

            this.delegateEvents();

            return this;
        }

    }, {_id: 'MediaViewList'});
});
