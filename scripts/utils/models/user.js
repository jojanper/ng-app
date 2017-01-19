/**
 * User model definition.
 */
define([
    'utils/models/model'
], function (BaseModel) {
    "use strict";

    var User = BaseModel.extend({
        setInitData: function() {
            this.username = this.options.username || '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.authenticated = this.options.authenticated || '';
            this.token = '';

            this.$types = {
                username: {
                    type: "text",
                    label: "Username",
                    directives: ['required']
                },
                password: {
                    type: "password",
                    label: "Password",
                    directives: ['required']
                }
            };

            this.$order = ['username', 'password'];
        },

        setLoginData: function(data) {
            this.authenticated = true;
        },

        isAuthenticated: function() {
            return this.authenticated;
        }
    });

    return User;
});
