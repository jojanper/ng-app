/**
 * Custom exceptions.
 */
define([
], function() {

    function UrlResolverError(message) {
        this.name = "UrlResolverError";
        this.message = (message || "");
    }
    UrlResolverError.prototype = Error.prototype;

    return {
        UrlResolverError: UrlResolverError
    };
});
