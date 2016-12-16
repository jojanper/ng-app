define(['common/html'], function (htmlLib) {
    "use strict";

    /**
     * Supported input validators, directives and their corresponding HTML templates.
     */
    var InputMap = {

        // Input is required
        'required': {
            inputTemplate: function($scope) {
                return 'required';
            },
            errorTemplate: function($scope) {
                return {text: 'Required!', errorRef: 'required'};
            }
        },

        // Email error
        'email': {
            errorTemplate: function($scope) {
                return {text: 'Invalid email!', errorRef: 'email'};
            }
        },

        // Input has maximum length
        'maxlength': {
            inputTemplate: function($scope, options) {
                return 'ng-maxlength="' + options.length + '"';
            },
            errorTemplate: function($scope, options) {
                return {text: 'Maximum length is ' + options.length + ' characters!', errorRef: 'maxlength'};
            }
        },

        // Input has minimum length
        'minlength': {
            inputTemplate: function($scope, options) {
                return 'ng-minlength="' + options.length + '"';
            },
            errorTemplate: function($scope, options) {
                return {text: 'Minimum length is ' + options.length + ' characters!', errorRef: 'minlength'};
            }
        },

        // Input has pattern requirement
        'pattern': {
            inputTemplate: function($scope, options) {
                return 'ng-pattern="' + options.pattern + '"';
            },
            errorTemplate: function($scope) {
                return {text: 'Required pattern does not match!', errorRef: 'pattern'};
            }
        },

        // Input is required for multi selector
        'multiRequired': {
            errorTemplate: function($scope) {
                return {text: 'Required!', ref: '.$modelValue.length < 1'};
            }
        },

        // Input contains black listed data
        'blacklist': {
            inputTemplate: function($scope, options) {
                return 'blacklist="' + options.items.join(',') + '"';
            },
            errorTemplate: function($scope) {
                return {text: 'Value is blacklisted!', errorRef: 'blacklist'};
            }
        }
    };

    return InputMap;
});
