define([
], function () {
    "use strict";

    var name = 'utilsfactory';

    /**
     * @ngdoc service
     * @name utilsfactory
     *
     * @description
     * Utility factory.
     */
    var UtilsFactory = function($state, appUrlResolver) {
        return {
            $$name: name,

            /**
             * @ngdoc
             * @name rest#getPageModels
             * @methodOf utilsfactory
             *
             * @description
             * Determine available models for current page.
             *
             * @param {Object} currentPageState State of current page.
             * @param {function(a,b)} callback Called when models data is available.
             * @param {array.<string>} callback.a Available models for current page.
             * @param {string} callback.b Display name of currently selected model, if any.
             *
             * @example
               <pre>
                 util.getPageModels($state.current, function(appModels, selectedModelDisplayName) {
                   // Do something with appModels
                   ;

                   // 'selectedModelDisplayName' contains the display name of application model that
                   // is in use in current page, if any.
                   ;
                 });
               </pre>
             */
            getPageModels: function(currentPageState, callback) {

                var appModels = [];
                var selectedModelDisplayName = '';

                // Locate the root page configuration for current page
                var appState = currentPageState;
                while (appState.self.parent) {
                    appState = appState.parent;
                }

                /*
                 * Determine the available application models that fall under the root configuration page
                 */
                var routeConfigs = $state.get();
                appUrlResolver.appSubModels(appState.link, function(subModels) {

                    // Include all available application models
                    for (var i = 0; i < subModels.length; i++) {

                        // Display name of the application model
                        var text = '';
                        for (var j = 0; j < routeConfigs.length; j++) {
                            if (routeConfigs[j].link === subModels[i]) {
                                text = routeConfigs[j].display || routeConfigs[j].breadcrumb;
                                break;
                            }
                        }

                        /*
                         * If the current page has the same prefix as the application model in question,
                         * then save the display name of the model that is valid for current page.
                         */
                        if ($state.$current.link.startsWith(subModels[i])) {
                            selectedModelDisplayName = text;
                        }

                        if (text) {
                            appModels.push({
                                link: $state.href(subModels[i]),
                                text: text
                            });
                        }
                    }

                    callback(appModels, selectedModelDisplayName);
                });
            }
        };
    };

    return {
        feature: 'factory',
        name: name,
        cls: ['$state', 'appUrlResolver', UtilsFactory]
    };
});
