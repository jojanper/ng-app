define(['underscore', 'backbone'], function(_, Backbone) {

    /**
     * Router helper.
     * @class
     */
    function RouterHelper(routes, opts) {

        // ID tags to look for conversion
        this.routeIDs = [':id'];

        this.routes = routes || {};
        this.opts = opts || {};

        /**
         * Map ID tags to real values.
         * @param {String} value Value to convert
         * @param {Dict} params Parameters for the conversion
         * @returns {String} Mapped value
         */
        this._valueMapping = function(value, params) {
            _.each(this.routeIDs, function(item) {
                var pattern = item.substring(1);
                if (value.indexOf(pattern) > -1) {
                    if (params.hasOwnProperty(pattern)) {
                        value = value.replace(item, params[pattern]);
                    }
                }
            });

            return value;
        },

        /**
         * Reverse route to URL based on specified (router) key and parameters
         * @param {String} routerKey Route key to convert
         * @param {Dict} routerParams Parameters for the route key
         * @returns {String} Reversed URL
         */
        this.reverse = function(routerKey, routerParams) {
            var params = routerParams || {};

            /*
             * Key exists for the route.
             */
            if (this.routes.hasOwnProperty(routerKey)) {
                var url = '';
                if (!params.hasOwnProperty('withoutPrefix')) {
                    url += opts.config.prefix + '#';
                }
                url += this.routes[routerKey];

                /*
                 * Convert the route parameters for specified values.
                 */
                return this._valueMapping(url, params);
            }

            throw new Error("Unknown route: " + routerKey);
        },

        /**
         * Construct URL based on specified URL and related parameters
         * @param {String} url Base URL
         * @param {Dict} urlParams Parameters for the URL construction
         * @returns {String} Constructed URL
         */
        this.urlHelper = function(url, urlParams) {
            return this._valueMapping(url, urlParams || {});
        }
    };

    return _.extend(RouterHelper, {_id: 'RouterHelper'});
});
