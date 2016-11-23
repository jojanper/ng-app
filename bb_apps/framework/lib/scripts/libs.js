define(['underscore',
        './template_loader/loader',
        './collection_loader/loader',
        './datatables/basetable',
        './base/basesubrouter',
        './base/baseview',
        './draal',
        './utils/alert',
        './utils/obj_wrapper',
        './utils/route_helper',
        './utils/sitenews',
        './router/routers',
        './utils/toolbox',
        './utils/appcontext',
        './utils/appevents',
        './utils/readmore',
        './utils/contextmenu',
        './utils/dialog'],
function(_) {

    var args = Array.prototype.slice.call(arguments, 1);
    var objs = _.chain(args).flatten(true).map(function (v) {
        return [v._id, v];
    }).object().value();

    return objs;
});
