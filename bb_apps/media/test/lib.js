(function () {

    require.config({

        baseUrl: "../lib",

        paths: {
            "jquery": "../components/jquery/jquery",
            "underscore": "../components/underscore-amd/underscore",
            "backbone": "../components/backbone-amd/backbone",
            "backbone.localStorage": "../components/backbone.localStorage/backbone.localStorage",
            "tpl": "../vendor/tpl",
            "text": "../components/requirejs-text/text"
        }
    });

    require(["jquery", "main"], function($, mod) {
        var view1 = new mod.Views.View1();

        $(document.body).append(view1.render().$el);
    });

})();
