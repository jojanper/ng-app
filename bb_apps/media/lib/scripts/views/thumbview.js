define(['jquery',
        'underscore',
        'backbone',
        'text!./templates/thumblist.html',
        'framework'],
function($, _, Backbone, thumbTemplate, AppLib) {

    return AppLib.BaseView.extend({

        el: '#thumb-details',

        events: {
            "click .thumbnail-sample-image": "imageClicked"
        },

        initialize: function(options) {
            _.bindAll(this, "render");
            this.options = options || {};
            this.vent = this.options.appContext.vent;
        },

        imageClicked: function(e) {
            var self = this;

            e.preventDefault();
            var id = $(e.currentTarget).data("id");
            console.log('CLICKED ' + id);
            //console.log(this.collection.at(id));
            var model = this.collection.at(id);

            //console.log(model.url());
            console.log(model);
            //model.id = '';

            var options = {
                /*
                  wait: true,
                */
                success: function(model, response) {
                    console.log('remove success');
                    console.log(model);
                    //console.log(response);
                    // this.unbind();
                    // this.remove();
                },
                error: function(model, response) {
                    self.vent.trigger('uimessage:error', {
                        msgTitle: 'Unable to delete thumbnail.',
                        response: response,
                    });
                }
            };

            model.destroy(options);

            //model.destroy(options);

            //model.delete(options);
        },

        render: function() {
            var self = this;
            var $el = $(this.el);
            var compiled_template = _.template(thumbTemplate);

            this.$el.empty();

            var id = this.options.collection_id;
            if (id) {
                var collection_obj = this.options.collection_obj;
                AppLib.CollectionManager.getCollection(collection_obj, id, function(collection) {
                    self.collection = collection;
                    var html = compiled_template({results: collection.models});
                    self.$el.html(html);
                });
            }

            return this;
        }

    }, {_id: 'ThumbViewList'});
});
