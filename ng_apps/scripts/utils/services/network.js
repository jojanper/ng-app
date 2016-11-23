define([], function () {
    "use strict";

    var name = 'network';

    /**
     * @ngdoc service
     * @name network
     *
     * @description
     * Remote connection service.
     */
    var RemoteConnectionService = function($http, appMessagesService, $q, $window) {

        this.$$name = name;

        /**
         * Execute HTTP request on remote system.
         *
         * @param {string} method HTTP method.
         * @param {string} url Target URL.
         * @param {Object} data HTTP request data, if any.
         * @param {boolean} ignoreDuplicateRequest true if duplicate HTTP requests should be ignored.
         * @param {boolean} cache true if HTTP request response should be cached.
         * @return {Object} Promise object.
         */
        function httpExecute(method, url, data, ignoreDuplicateRequest, cache) {
            var deferred = $q.defer();

            return $http({
                method: method,
                url: url,
                data: data,
                cache: cache || false,
                ignoreDuplicateRequest: ignoreDuplicateRequest || false
            }).then(function(response) {
                // Promise is fulfilled
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {

                // Application code at server side has changed, make full reload to fetch the new js etc files.
                if (response.status === 418) {
                    $window.location.reload(true);
                }

                /*
                 * Report errors to UI.
                 */
                var errors = '';
                if (response.data.errors) {
                    var len = response.data.errors.length;
                    for (var i = 0; i < len; i++) {
                        errors += ((len > 1) ? '<br/>' : '') + response.data.errors[i];
                    }
                }
                else {
                    errors = '<div>' + response.data + '</div>';
                }

                appMessagesService.addMessage({type: "error", msgBody: errors});

                // Promise is rejected
                deferred.reject(response);

                return deferred.promise;
            });
        }

        /**
         * @ngdoc
         * @name network#get
         * @methodOf network
         *
         * @description
         * Execute HTTP GET on remote system.
         *
         * @param {string} url Target URL.
         * @param {Object} data HTTP request data, if any.
         * @param {boolean} cache true if request is cached.
         * @return {Object} Promise.
         *
         * @see {@link httpExecute}
         */
        this.get = function(url, data, cache) {
            if (data === true) {
                cache = data;
            }

            return httpExecute('get', url, data, (cache) ? true : false, cache);
        };

        /**
         * @ngdoc
         * @name network#post
         * @methodOf network
         *
         * @description
         * Execute HTTP POST on remote system.
         *
         * @param {string} url Target URL.
         * @param {Object} data HTTP data, if any.
         * @return {Object} Promise.
         *
         * @see {@link httpExecute}
         */
        this.post = function(url, data) {
            return httpExecute('post', url, data);
        };

        /**
         * @ngdoc
         * @name network#put
         * @methodOf network
         *
         * @description
         * Execute HTTP PUT on remote system.
         *
         * @param {string} url Target URL.
         * @param {Object} data HTTP data, if any.
         * @return {Object} Promise.
         *
         * @see {@link httpExecute}
         */
        this.put = function(url, data) {
            return httpExecute('put', url, data);
        };

        /**
         * @ngdoc
         * @name network#patch
         * @methodOf network
         *
         * @description
         * Execute HTTP PATCH on remote system.
         *
         * @param {string} url Target URL.
         * @param {Object} data HTTP data, if any.
         * @return {Object} Promise.
         *
         * @see {@link httpExecute}
         */
        this.patch = function(url, data) {
            return httpExecute('patch', url, data);
        };

        /**
         * @ngdoc
         * @name network#delete
         * @methodOf network
         *
         * @description
         * Execute HTTP DELETE on remote system.
         *
         * @param {string} url Target URL.
         * @param {Object} data HTTP data, if any.
         * @return {Object} Promise.
         *
         * @see {@link httpExecute}
         */
        this.delete = function(url, data) {
            return httpExecute('delete', url, data);
        };
    };

    return {
        feature: 'service',
        name: name,
        cls: ['$http', 'appMessagesService', '$q', '$window', RemoteConnectionService]
    };
});
