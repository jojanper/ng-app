({
    baseUrl: "../app/scripts",
    name: 'main',

    paths: {
        "requireLib": "../../components/requirejs/require",
        "jquery": "../../components/jquery/dist/jquery",
        "jquery.cookie": "../components/jquery-cookie/jquery.cookie",
        "jquery.ui": "../components/jquery-ui/ui/jquery-ui",
        "underscore": "../../components/underscore-amd/underscore",
        "backbone": "../../components/backbone-amd/backbone",
        "backbone.localStorage": "../../components/backbone.localStorage/backbone.localStorage",
        "framework": "../../components/framework/app_framework",
        "backbone.subroute": "../../vendor/backbone.subroute",
    },

    include: ['requireLib'],

    /*
     * Enable this if dependencies are not to be bundled to application script.
     * Note that this may have implications in case user defined plugins are
     * defined outside of requirejs scope. Also the dependencies need to be
     * available in the scripts directory.
     */
    //exclude: ["jquery", "underscore", "backbone", "backbone.localStorage"],

    optimize: 'none',
    optimizeCss: 'standard'
})
