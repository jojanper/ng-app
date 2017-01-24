/**
 * User model definition.
 */
define([
    'utils/models/model'
], function (BaseModel) {
    "use strict";

    var User = BaseModel.extend({
        setInitData: function() {
            this.reset();

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

        reset: function() {
            this.id = null;
            this.username = '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.authenticated = false;
            this.displayName = '';
            this.expires = null;
        },

        setLoginData: function(data) {
            if (data && data.hasOwnProperty('id')) {
                this.authenticated = true;
                this.id = data.id;
                this.displayName = data.display;
                this.email = data.email;
                this.expires = data.expires;
            }
            else {
                this.reset();
            }

            return this;
        },

        isAuthenticated: function() {
            return this.authenticated === true;
        }
    });

    return User;
});
