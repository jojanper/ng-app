define(['jquery', 'underscore'], function($, _) {

    return {
        _id: 'ObjWrapper',

        convert: function(objs) {
            var objs_wrapper = _.chain(objs).flatten(true).map(function(v) {
                return [v._id, v];
            }).object().value();

            return objs_wrapper;
        }
    };
});
