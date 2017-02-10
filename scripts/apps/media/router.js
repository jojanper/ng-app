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
            template: function() { return baseListTemplateFn(''); }
        },


        // Upload listing view
        {
            link: 'admin.upload',
            url: 'upload',
            model: 'upload',
            breadcrumb: 'Uploaded media',
            parent: 'admin',
            template: function() { return baseListTemplateFn(UploadListTemplate); }
        },
        // Upload editing view
        {
            link: 'admin.upload.edit',
            url: ':id',
            model: 'upload',
            parent: 'admin.upload',
            template: function() { return baseEditTemplateFn('upload'); }
        },


        // Media folder listing view
        {
            link: 'admin.mediafolder',
            url: 'mediafolder',
            model: 'mediafolder',
            breadcrumb: 'Media folder',
            parent: 'admin',
            template: function() { return baseListTemplateFn(MediaListTemplate); }
        },

        // Media folder editing view
        {
            link: 'admin.mediafolder.edit',
            url: ':id',
            model: 'mediafolder',
            parent: 'admin.mediafolder',
            template: function() { return baseEditTemplateFn('mediafolder'); }
        }
    ];
});
