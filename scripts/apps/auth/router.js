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
        }
    ];
});
