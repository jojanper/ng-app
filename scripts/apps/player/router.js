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
            link: 'player.music',
            url: 'music',
            model: 'music',
            breadcrumb: 'Music',
            parent: 'player',
            template: AudioPlayerTemplate
        },

        {
            link: 'player.video',
            url: 'video',
            model: 'video',
            breadcrumb: 'Video',
            parent: 'player',
            template: VideoPlayerTemplate
        },

        {
            link: 'player.image',
            url: 'image',
            model: 'image',
            breadcrumb: 'Image',
            parent: 'player',
            template: ''
        }
    ];
});
