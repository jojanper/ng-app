define([
    'jquery',
    'utils/common/resolver',
    'utils/common/exceptions'
], function ($, resolverFn, Exceptions) {
    "use strict";

    function findModelDataMatch(appData, refName, field) {
        for (var i in appData) {
            if (field) {
                if (refName === appData[i][field]) {
                    return appData[i];
                }
            }
            else {
                if (i === refName) {
                    return appData[i];
                }
            }
        }

        return null;
    }

    /**
     * @ngdoc service
     * @name appUrlResolver
     *
     * @description
     * Service for resolving virtual URL name and associated data to physical server URLs.
     */
    var AppUrlResolver = function(network, $q, appLogger) {
        var self = this;

        this.$$name = 'appUrlResolver';

        // Application data for URL resolving
        this.appData = null;

        /**
         * @ngdoc
         * @name appUrlResolver#loadData
         * @methodOf appUrlResolver
         *
         * @description
         * Load base application data from server. The data includes the available models
         * and associated actions.
         *
         * @return {Object} Promise to application data.
         *
         * @example
           <pre>
           appUrlResolver.loadData();
           </pre>
         */
        this.loadData = function() {
            var deferred = $q.defer();

            // Data already available, resolve promise
            if (this.appData) {
                deferred.resolve(this.appData);
                return deferred.promise;
            }

            // Fetch the data and on success resolve the promise. Cache the request.
            network.get(resolverFn('rest-api-models'), true).then(function(data) {
                self.appData = data;
                deferred.resolve(self.appData);
            }, function(response) {
                deferred.reject(response);
            });

            return deferred.promise;
        };

        /**
         * @description
         * Internal translator from model parameters to server URL.
         *
         * @param {String} modelName Name of model.
         * @param {String} resolverName Name of API resolver.
         * @param {Function} resolverDataFn Callback to retrieve data for URL resolver.
         * @return {Object} Promise to resolved URL. The promise success function contains url and data attributes.
         */
        this._apiUrl = function(modelName, resolverName, resolverDataFn) {
            var deferred = $q.defer();

            this.loadData().then(function(data) {
                var modelData = findModelDataMatch(data, modelName, 'model');
                if (modelData) {
                    var actionData = (resolverDataFn) ? resolverDataFn(modelData) : {};

                    var url = resolverFn(resolverName, $.extend({
                        /*jshint camelcase: false */
                        appLabel: modelData.app_label,
                        /*jshint camelcase: true */
                        model: modelData.model
                    }, actionData));

                    deferred.resolve({url: url, data: actionData.actionDetails});
                }
                else {
                    var msg = 'Unable to resolve "' + resolverName + '" API for model ' + modelName;
                    appLogger.warn(msg);
                    deferred.reject(msg);
                }

                return deferred.promise;
            }).catch(function(e) {
                deferred.reject(e.message);
            });

            return deferred.promise;
        };

        /**
         * @ngdoc
         * @name appUrlResolver#metaUrl
         * @methodOf appUrlResolver
         *
         * @description
         * Translate model name to corresponding meta data URL.
         *
         * @param {String} modelName Name of model.
         * @return {Object} Promise to meta URL.
         *
         * @example
           <pre>
           appUrlResolver.metaUrl('mediafolder');
           </pre>
         */
        this.metaUrl = function(modelName) {
            return this._apiUrl(modelName, 'rest-api-model-meta');
        };

        /**
         * @ngdoc
         * @name appUrlResolver#actionUrl
         * @methodOf appUrlResolver
         *
         * @description
         * Translate model, (model ID) and action name to corresponding action or model ID action URL.
         *
         * @param {String} modelName Name of model.
         * @param {String} actionName Name of action.
         * @param {number=} modelId Model ID.
         * @return {Object} Promise to action URL.
         *
         * @example
           <pre>
           appUrlResolver.actionUrl('mediafolder', 'create');
           appUrlResolver.actionUrl('mediafolder', 'edit', 1);
           </pre>
         */
        this.actionUrl = function(modelName, actionName, modelId) {

            // Model ID related action
            if (modelId) {
                return this._apiUrl(modelName, 'rest-api-model-actions', function() {
                    return {action: actionName, modelId: modelId};
                });
            }

            // Model related action
            return this._apiUrl(modelName, 'rest-api-actions', function(modelData) {
                var actionData = findModelDataMatch(modelData.actions, actionName);
                if (actionData) {
                    return {action: actionName, actionDetails: actionData};
                }

                throw new Exceptions.UrlResolverError("Action " + actionName + ' not supported for ' + modelName);
            });
        };

        /**
         * @ngdoc
         * @name appUrlResolver#listingUrl
         * @methodOf appUrlResolver
         *
         * @description
         * Translate model name to corresponding data listing URL.
         *
         * @param {String} modelName Name of model.
         * @return {Object} Promise to listing URL.
         *
         * @example
           <pre>
           appUrlResolver.listingUrl('mediafolder');
           </pre>
         */
        this.listingUrl = function(modelName) {
            return this._apiUrl(modelName, 'rest-api');
        };

        /**
         * @ngdoc
         * @name appUrlResolver#detailsUrl
         * @methodOf appUrlResolver
         *
         * @description
         * Translate model name and ID to corresponding data details URL.
         *
         * @param {String} modelName Name of model.
         * @param {number} modelId Model ID.
         * @return {Object} Promise to details URL.
         *
         * @example
           <pre>
           appUrlResolver.detailsUrl('mediafolder', 1);
           </pre>
         */
        this.detailsUrl = function(modelName, modelId) {
            return this._apiUrl(modelName, 'rest-api-model-id', function() {
                return {modelId: modelId};
            });
        };

        /**
         * @ngdoc
         * @name appUrlResolver#historyUrl
         * @methodOf appUrlResolver
         *
         * @description
         * Translate model name and ID to corresponding data ID change history URL.
         *
         * @param {String} modelName Name of model.
         * @param {number} modelId Model ID.
         * @return {Object} Promise to history URL.
         *
         * @example
           <pre>
           appUrlResolver.historyUrl('mediafolder', 1);
           </pre>
         */
        this.historyUrl = function(modelName, modelId) {
            return this._apiUrl(modelName, 'rest-api-model-id-history', function() {
                return {modelId: modelId};
            });
        };

        /**
         * @ngdoc
         * @name appUrlResolver#appSubModels
         * @methodOf appUrlResolver
         *
         * @description
         * Determine list of submodels available for application component.
         *
         * @param {String} appLabal Name of application component.
         * @param {function(models)} successFn Called when submodels are available.
         * @param {array.<string>} successFn.models Available submodels.
         *
         * @example
           <pre>
           appUrlResolver.appSubModels('media', function(appModels) {
             // Do something with appModels
           });
           </pre>
         */
        this.appSubModels = function(appLabel, successFn) {
            this.loadData().then(function(data) {
                var subModels = [];
                for (var i = 0; i < data.length; i++) {
                    /*jshint camelcase: false */
                    if (data[i].app_label === appLabel) {
                        subModels.push(data[i].model);
                    }
                    /*jshint camelcase: true */
                }

                if (successFn) {
                    successFn(subModels);
                }
            });
        };
    };

    return {
        feature: 'service',
        name: 'appUrlResolver',
        cls: ['network', '$q', 'appLogger', AppUrlResolver],

        /*
         * Instantiate the service already in the run block to avoid the lazy instantion scheme
         * that is traditionally associated with services. This way the available app models are
         * most likely already loaded before there is any need from view controllers.
         */
        run: ['appUrlResolver', 'executeUrlResolverRunMethod', function(appUrlResolver, executeUrlResolverRunMethod) {
            var status = true;

            if (backendConfig.hasOwnProperty('executeUrlResolverRunMethod') &&
                !backendConfig.executeUrlResolverRunMethod) {
                status = false;
            }

            if (!status || !executeUrlResolverRunMethod) {
                return;
            }

            appUrlResolver.loadData();
        }],

        constant: ['executeUrlResolverRunMethod', true]
    };
});
