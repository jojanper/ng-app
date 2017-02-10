define([
    'common/utils'
], function (UtilsLib) {
    "use strict";

    function getAppLabel(state) {
        var appLabel = state.linkMap;
        if (!appLabel) {
            appLabel = state.model || state.link;
        }

        return appLabel;
    }

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
                 * Determine the available application models that fall under the root configuration page.
                 * The label used for this analysis is either the link or linkMap property within the
                 * currect page state object. This allows to use different display name in UI (link) compared
                 * to name used in backend (linkMap).
                 */
                var routeConfigs = $state.get();
                appUrlResolver.appSubModels(getAppLabel(appState), function(subModels) {

                    // Include all available application models
                    for (var i = 0; i < subModels.length; i++) {

                        // Display name of the application model
                        var text = '';
                        var routeConfig;
                        for (var j = 0; j < routeConfigs.length; j++) {
                            if (getAppLabel(routeConfigs[j]) === subModels[i]) {
                                routeConfig = routeConfigs[j];
                                text = routeConfigs[j].display || routeConfigs[j].breadcrumb;
                                break;
                            }
                        }

                        /*
                         * If the current page has the same prefix as the application model in question,
                         * then save the display name of the model that is valid for current page.
                         */
                        if (getAppLabel($state.$current).startsWith(subModels[i])) {
                            selectedModelDisplayName = text;
                        }

                        if (text) {
                            appModels.push({
                                link: $state.href(routeConfig.link),
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
