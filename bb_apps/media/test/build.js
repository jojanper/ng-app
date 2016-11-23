(function () {

    require.config({

        paths: {
            "jquery": "../components/jquery/jquery",
            "underscore": "../components/underscore-amd/underscore",
            "backbone": "../components/backbone-amd/backbone",
            "thumbnails": "../thumbnails",
            "backbone.localStorage": "../components/backbone.localStorage/backbone.localStorage",
            "text": "../components/requirejs-text/text"
        }
    });

    require(["jquery", "thumbnails"], function( $, mod ) {

        var view1 = new mod.Views.View1();

        $(document.body).append(view1.render().$el);

        console.log(view1);

        console.log(mod.Models);
        //var thumbs = new c1.Models.Thumbnails({url: 'http://127.0.0.1:8000/api/test_api'});
        var thumbs = new mod.Models.Thumbnails();

        thumbs.create({title: 'Test thumbs', location: 'Server URL'});

        console.log(mod.Views);

        thumbs.fetch({
            success: function(thumbnails){
                console.log(thumbnails);

                var view2 = new mod.Views.ThumbViewList({collection: thumbs})
                console.log(view2.renderList());
                view2.renderList($('body'));
            },
            error: function(model, error) {
                // TODO: handle errors nicer
                console.log(model);
                console.log(error);
                alert(error);
            }
        });
    });

})();
