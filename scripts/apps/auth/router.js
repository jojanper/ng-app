define([
], function () {
    "use strict";

    return [
        {
            link: 'auth',
            abstract: true,
            template: '<ui-view/>'
        },
        {
            link: 'auth.login',
            url: 'login',
            breadcrumb: false,
            public: true,
            template: '<dng-login></dng-login>'
        },
        {
            link: 'auth.logout',
            url: 'logout',
            breadcrumb: false,
            template: '<dng-logout></dng-logout>'
        },
        {
            link: 'auth.register',
            url: 'register',
            breadcrumb: false,
            public: true,
            template: '<dng-register></dng-register>'
        },
        {
            link: 'auth.activate',
            url: 'activate/:activationkey',
            breadcrumb: false,
            public: true,
            template: '<dng-account-activate></dng-account-activate>'
        },
        {
            link: 'auth.extactivation',
            url: 'ext-activate/:provider',
            breadcrumb: false,
            public: true,
            template: '<dng-ext-auth-activation></dng-ext-auth-activation>'
        },
        {
            link: 'auth.passwordreset',
            url: 'password-reset',
            breadcrumb: false,
            public: true,
            template: '<dng-password-reset></dng-password-reset>'
        },
        {
            link: 'auth.passwordresetchange',
            url: 'password-reset-change/:uidb/:token',
            breadcrumb: false,
            public: true,
            template: '<dng-password-reset-change></dng-password-reset-change>'
        },
        {
            link: 'auth.passwordchange',
            url: 'password-change',
            breadcrumb: false,
            template: '<dng-password-change></dng-password-change>'
        },
        {
            link: 'auth.userprofile',
            url: 'userprofile',
            breadcrumb: false,
            template: '<dng-user-profile></dng-user-profile>'
        }
    ];
});
