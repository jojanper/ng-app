/**
 * User model definition.
 */
define([
    'common/toolbox'
], function (Toolbox) {
    "use strict";

    var User = Toolbox.BaseClass.extend({
        constructor: function(details) {
            this.username = '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.authenticated = false;
            this.token = '';
        },

        isAuthenticated: function() {
            return this.authenticated;
        }
    });

    return User;
});
