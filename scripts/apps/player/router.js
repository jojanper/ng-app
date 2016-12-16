define([
    '../common/model_list',
    'text!./controllers/templates/audioplayer.html',
    'text!./controllers/templates/videoplayer.html'
], function (baseListTemplateFn, AudioPlayerTemplate, VideoPlayerTemplate) {
    "use strict";

    return [
        {
            link: 'player',
            display: 'Media player',
            template: function() { return baseListTemplateFn(''); }
        },

        {
            link: 'music',
            breadcrumb: 'Music',
            parent: 'player',
            template: AudioPlayerTemplate
        },

        {
            link: 'video',
            breadcrumb: 'Video',
            parent: 'player',
            template: VideoPlayerTemplate
        },

        {
            link: 'image',
            breadcrumb: 'Image',
            parent: 'player',
            template: ''
        }
    ];
});
