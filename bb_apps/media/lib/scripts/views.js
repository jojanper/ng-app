define(['underscore',
        './views/mediaview',
        './views/masterview'],
       function(_) {

           var args = Array.prototype.slice.call(arguments, 1);
           var Views = _.chain(args).map(function(v) {
               return [v._id, v];
           }).object().value();

           return Views;
       });
