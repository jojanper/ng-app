/**
 * @description
 * Application logger.
 */
define([], function () {
    "use strict";

    var LoggerService = function($log) {
        var self = this;

        self.info = function(message) {
            $log.info(message);
        };

        self.warn = function(message) {
            $log.warn(message);
        };

        self.error = function(message) {
            $log.error(message);
        };

        self.debug = function(message) {
            $log.debug(message);
        };
    };

    return {
        feature: 'service',
        name: 'appLogger',
        cls: ['$log', LoggerService]
    };
});
