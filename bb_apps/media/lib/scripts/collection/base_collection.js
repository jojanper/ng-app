define(['jquery',
        'underscore',
        'backbone',
        'backbone.localStorage'],
function($, _, Backbone) {

    return Backbone.Collection.extend({

        url: function() {
            return this.load_url;
        },

        initialize: function(options) {
            this.load_url = options.url;
            this.selectedModelId = 0;
        },

        /**
         * Assign model with id as selected model. Selected model
         * indicates that this model is currently under more detailed view,
         * e.g., special visualization may be used to highlight the
         * selected model.
         */
        select: function(id) {

            if (id > 0)
                this.selectedModelId = id;

            var model = this.get(id);

            if (model === undefined) {
                // Unselect all
                $.each(this.models, function() {
                    this.select(false);
                });

                return false;
            }

            if (!model.selected) {

                // Unselect all
                $.each(this.models, function() {
                    this.select(false);
                });

                // Select the specified model and trigger corresponding selection event
                this.get(id).select(true);
                this.trigger('media:clicked');
            }

            return true;
        },

        /**
         * Search and return models that satisfy the specified search word
         * in the model's name or title. No match means no media is shown.
         * Empty search keyword means all media are shown.
         */
        search: function(searchKeyword) {

            /*-- Search key specified. --*/
            if (searchKeyword !== undefined) {
                this.filter(function(model) {
                    if (model.get('name').toLowerCase().indexOf(searchKeyword) >= 0 ||
                        model.get('title').toLowerCase().indexOf(searchKeyword) >= 0) {
                        model.set_visibility(true);
                        return true;
                    }

                    model.set_visibility(false);
                    return false;
                });
            }

            /*-- All media should be visible. --*/
            else {
                $.each(this.models, function() {
                    this.set_visibility(false);
                });
            }

            this.trigger('media:filtered');

            return this;
        },

        /**
         * Return visible media items.
         */
        visible: function() {
            return this.filter(function(model) {
                if (model.visible) {
                    return true;
                }

                return false;
            });
        }

    });
});
