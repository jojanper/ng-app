{
    baseUrl: "../lib",
    include: ["../build/almond", "main"],
    exclude: ["jquery", "underscore", "backbone", "backbone.subroute"],

    shim: {
        'jquery.cookie': {
            deps: ['jquery'],
            exports: 'jquery.cookie'
        },

        'jquery.ui': {
            deps: ['jquery'],
            exports: 'jquery'
        },

        'jQuery.contextMenu': {
            deps: ['jquery'],
            exports: 'jQuery.contextMenu'
        },

        'datatables': {
            deps: ['jquery'],
            exports: 'jquery'
        },

        'readmore': {
            deps: ['jquery'],
            exports: 'jquery'
        },

        /*
        'datatables.jqueryui': {
            deps: ['datatables'],
            exports: 'jquery'
        }
        */
    },

    wrap: {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    },

    paths: {
        "jquery": "../components/jquery/dist/jquery",
        "jquery.cookie": "../components/jquery-cookie/jquery.cookie",
        "jquery.ui": "../components/jquery-ui/jquery-ui",
        "jQuery.contextMenu": "../components/jQuery-contextMenu/src/jquery.contextMenu",
        "backbone": "../components/backbone-amd/backbone",
        "underscore": "../components/underscore-amd/underscore",
        "text": "../components/requirejs-text/text",
        "datatables": "../components/datatables/media/js/jquery.dataTables",
        //"datatables.jqueryui": "../lib/scripts/datatables/dataTables.jqueryui"
        "backbone.subroute": "../vendor/backbone.subroute",
        "readmore": "../vendor/readmore"
    },

    optimize: "none",
}