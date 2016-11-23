{
    baseUrl: "../lib",
    include: ["../build/almond", "main"],
    exclude: ["jquery", "underscore", "backbone", "backbone.localStorage", "backbone.subroute", "framework"],
    stubModules: ['tpl'],

    shim: {
    },

    wrap: {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    },

    paths: {
        "jquery": "../components/jquery/dist/jquery",
        "underscore": "../components/underscore-amd/underscore",
        "backbone": "../components/backbone-amd/backbone",
        "backbone.localStorage": "../components/backbone.localStorage/backbone.localStorage",
        "text": "../components/requirejs-text/text",
        "thumbnails": "../thumbnails",
        "framework": "../components/framework/app_framework",
        "tpl": "../vendor/tpl",
        "backbone.subroute": "../vendor/backbone.subroute",
    },

    optimize: "none",
}
