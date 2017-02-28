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
            link: 'auth.passwordreset',
            url: 'password-reset',
            breadcrumb: false,
            public: true,
            template: '<dng-password-reset></dng-password-reset>'
        },
        {
            link: 'auth.passwordresetchange',
            url: 'password-reset-change/:id',
            breadcrumb: false,
            public: true,
            template: '<dng-password-reset-change></dng-password-reset-change>'
        },
        {
            link: 'auth.passwordchange',
            url: 'password-change',
            breadcrumb: false,
            template: '<dng-password-change></dng-password-change>'
        }
    ];
});
