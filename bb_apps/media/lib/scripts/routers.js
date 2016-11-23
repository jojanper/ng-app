define(['underscore', './router/thumbs_router'], function(_) {

    var args = Array.prototype.slice.call(arguments, 1);
    var objs = _.chain(args).flatten(true).map(function (v) {
        return [v._id, v];
    }).object().value();

    return objs;
});
