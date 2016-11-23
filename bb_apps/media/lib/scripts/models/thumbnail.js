define(['jquery',
        'underscore',
        './base_model',
        '../collection/base_collection',
        'backbone',
        'backbone.localStorage'],
function($, _, BaseModel, BaseCollection, Backbone) {

    var Thumbnail = BaseModel.extend({
        destroy: function(options) {
            console.log('destroy');
            //this.id = '';

            var _options = $.extend({
                wait: true,
                success: function(model, response) {
                    console.log('remove success');
                    console.log(model);
                    //console.log(response);
                    // this.unbind();
                    // this.remove();
                },
                error: function(model, response) {
                    console.log('remove error');
                    console.log(response);
                }
            }, options);

            //this.destroy(_options);
            console.log(_options);
            console.log(this);
            return Backbone.Model.prototype.destroy.call(this, _options);
        }
    }, {_id: 'Thumbnail'});

    var Thumbnails = BaseCollection.extend({
        model: Thumbnail
    }, {_id: 'Thumbnails'});

    return [Thumbnail, Thumbnails];
});
