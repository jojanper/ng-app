define([
    'text!./controllers/templates/index.html'
], function (IndexTemplate) {
    "use strict";

    return [
        {
            link: 'home',
            display: 'Home',
            breadcrumb: false,
            default: true,
            public: true,
            template: IndexTemplate
        }
    ];
});
