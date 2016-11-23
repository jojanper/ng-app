define(['jquery',
        'underscore',
        './base_model',
        '../collection/base_collection',
        'backbone',
        'backbone.localStorage'],
function($, _, BaseModel, BaseCollection, Backbone) {

    var Media = BaseModel.extend({
    }, {_id: 'Media'});

    var MediaCollection = BaseCollection.extend({
        model: Media
    }, {_id: 'MediaCollection'});

    return [Media, MediaCollection];
});
