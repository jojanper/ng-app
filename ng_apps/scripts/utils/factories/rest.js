define([
    'utils/models/metamodel',
    'utils/common/signals'
], function (MetaModel, Signals) {
    "use strict";

    function getModelMeta(model, url, appUrlResolver, network, success, error) {
        // Resolve the server URL for meta data
        appUrlResolver.metaUrl(model).then(function(dataObj) {

            // Load the model meta data so that necessary form fields can be constructed
            network.get(dataObj.url, true).then(function(metadata) {

                // Create model instance from received meta data
                var modelObj = new MetaModel({
                    metadata: metadata,
                    postUrl: url,
                    model: model,
                    name: model
                });

                success(modelObj);
            }, error);
        }, error);
    }

    /**
     * @ngdoc service
     * @name rest
     *
     * @description
     * ReST factory for server communication. Contains interfaces for retrieving and submitting server data.
     */
    var RestFactory = function(network, appUrlResolver) {
        return {
            $$name: 'rest',

            /**
             * @ngdoc
             * @name rest#getModelMeta
             * @methodOf rest
             *
             * @description
             * Get model meta from server and instantiate new model item based on received data. Can be used,
             * for example, in various model item wizards.
             *
             * @param {string} model Model name.
             * @param {string} url HTTP POST url for model changes, null if not known at this point.
             * @param {function} success Success callback function.
             * @param {function=} error Error callback function.
             *
             * @example
               <pre>
                 rest.getModelMeta('mediafolder', null, function(modelObj) {
                     // Do something with modelObj
                 }, function() {
                     // Failure handling
                 });
               </pre>
             */
            getModelMeta: function(model, url, success, error) {
                getModelMeta(model, url, appUrlResolver, network, success, error);
            },

            /**
             * @ngdoc
             * @name rest#getModelData
             * @methodOf rest
             *
             * @description
             * Get model data from server and instantiate new model item based on received data.
             *
             * @param {string} model Model name.
             * @param {number} modelId Model ID.
             * @param {function} success Success callback function.
             * @param {function=} error Error callback function.
             *
             * @example
               <pre>
                 rest.getModelData('mediafolder', 1, function(modelObj) {
                     // Do something with modelObj
                 });
               </pre>
             */
            getModelData: function(model, modelId, success, error) {
                getModelMeta(model, null, appUrlResolver, network, function(modelObj) {
                    appUrlResolver.detailsUrl(model, modelId).then(function(dataObj) {
                        network.get(dataObj.url).then(function(modelData) {
                            appUrlResolver.actionUrl(model, 'edit', modelId).then(function(editObj) {
                                modelObj.setModelData(modelData);
                                modelObj.setPostUrl(editObj.url);
                                success(modelObj);
                            }, error);
                        }, error);
                    }, error);
                }, error);
            },

            /**
             * @ngdoc
             * @name rest#submitData
             * @methodOf rest
             *
             * @description
             * Submit data to server.
             *
             * @param {Object} data Data to send.
             * @param {string} url Endpoint URL.
             * @param {Object} $scope Scope object.
             * @param {Object|string} model Model object or name of `data`.
             * @param {boolean} reload If true, table reload event is triggered on success.
             * @param {function=} success Success callback function.
             * @param {function=} error Error callback function.
             *
             * @example
               <pre>
                 var data = {name: 'test'};
                 rest.submitData(data, '/api/post', $scope, $scope.model, true, function(data) {
                     // Data successfully submitted
                 });
               </pre>
             */
            submitData: function(data, url, $scope, model, reload, success, error) {
                network.post(url, data).then(function(responseData) {
                    if (reload) {
                        // Send signal to associated tables to indicate that new data is available
                        var signal = new Signals.tableReload.cls($scope, {model: model});
                        $scope.$root.$emit(Signals.tableReload.name, signal);
                    }

                    if (success) {
                        success(responseData);
                    }

                }, error);
            }
        };
    };

    return {
        feature: 'factory',
        name: 'rest',
        cls: ['network', 'appUrlResolver', RestFactory]
    };
});
