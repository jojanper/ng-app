define([
], function () {
    "use strict";

    return [
        {
            link: 'login',
            breadcrumb: false,
            template: '<dng-login></dng-login>'
        },
        {
            link: 'logout',
            breadcrumb: false,
            template: '<dng-logout></dng-logout>'
        }
    ];
});
