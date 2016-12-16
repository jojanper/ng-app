define([
    '../common/model_list',
    '../common/model_edit',
    'text!./controllers/templates/media_list.html',
    'text!./controllers/templates/upload_list.html'
], function (baseListTemplateFn, baseEditTemplateFn, MediaListTemplate, UploadListTemplate) {
    "use strict";

    return [
        // Main view, no listing available
        {
            link: 'admin',
            linkMap: 'media',
            display: 'Admin',
            default: true,
            template: function() { return baseListTemplateFn(''); }
        },


        // Upload listing view
        {
            link: 'upload',
            breadcrumb: 'Uploaded media',
            parent: 'admin',
            template: function() { return baseListTemplateFn(UploadListTemplate); }
        },
        // Upload editing view
        {
            link: 'upload.edit',
            url: ':id',
            parent: 'upload',
            template: function() { return baseEditTemplateFn('upload'); }
        },


        // Media folder listing view
        {
            link: 'mediafolder',
            breadcrumb: 'Media folder',
            parent: 'admin',
            template: function() { return baseListTemplateFn(MediaListTemplate); }
        },

        // Media folder editing view
        {
            link: 'mediafolder.edit',
            url: ':id',
            parent: 'mediafolder',
            template: function() { return baseEditTemplateFn('mediafolder'); }
        }
    ];
});
