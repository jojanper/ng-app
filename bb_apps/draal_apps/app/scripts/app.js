define(["jquery",
        "underscore",
        "app_router",
        "module",
        "backbone",
        "backbone.localStorage",
        "backbone.subroute"],
function($, _, ApplicationRouter, module, Backbone) {

    var THUMBS_PREFIX = '!/video-thumbs/';
    var SITE_MESSAGES_PREFIX = '!/site-messages/';

    return {
        start: function () {
            require(['app_framework', 'media'], function(AppLib, MediaLib) {

                var routerTags = {};

                routerTags[THUMBS_PREFIX] = {
                    'key': 'Thumbs',
                    'object': MediaLib.Routers.ThumbsRouter,
                    'prefix': THUMBS_PREFIX
                };

                routerTags[SITE_MESSAGES_PREFIX] = {
                    'key': 'SiteMessages',
                    'object': AppLib.Routers.SiteMessages,
                    'prefix': SITE_MESSAGES_PREFIX
                };

                console.log(AppLib);

                /*
                 * Configuration settings for the application.
                 */
                app_globals = module.config();

                /*
                 * Application router(s).
                 */
                var AppRouter = {};
                AppRouter.Router = ApplicationRouter.extend({

                    routes: {
                        '!/video-thumbs/*subroute': "invokeThumbsModule",
                        '!/site-messages/*subroute': "invokeSiteMessagesModule",
                        "*actions": "defaultRoute"
                    },

                    /*
                     * Start thumbs router.
                     */
                    invokeThumbsModule: function(subroute) {
                        this._startRouter(THUMBS_PREFIX);
                    },

                    /*
                     * Start site messages router.
                     */
                    invokeSiteMessagesModule: function(subroute) {
                        this._startRouter(SITE_MESSAGES_PREFIX);
                    }
                });

                var appContext = new AppLib.AppContext();
                var appEvents = new AppLib.AppEvents({appContext: appContext});

                app = new AppRouter.Router({
                    'appLib': AppLib,
                    'mediaLib': MediaLib,
                    'config': app_globals.config,
                    'routerTags': routerTags,
                    'appContext': appContext
                });

                /*
                 * Handle route to URL mappings.
                 */
                var routerHelperObj = new AppLib.RouterHelper(app.reverse(), app_globals);
                Backbone.Router.reverse = function(key, parameters) {
                    return routerHelperObj.reverse(key, parameters);
                };

                /*
                 * Handle URL construction.
                 */
                Backbone.Router.urlHelper = function(url, parameters) {
                    return routerHelperObj.urlHelper(url, parameters);
                };

                Backbone.history.start();

                /*
                 * Set default values for future Ajax requests.
                 */
                $.ajaxSetup({cache: false});
            });
        }
    }
});
