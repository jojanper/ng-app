define([
    'text!./templates/login.html',
    'text!./templates/logout.html'
], function (LoginTemplate, LogoutTemplate) {
    "use strict";

    return [
        {
            link: 'login',
            breadcrumb: false,
            template: LoginTemplate
        },
        {
            link: 'logout',
            breadcrumb: false,
            template: LogoutTemplate
        }
    ];
});
