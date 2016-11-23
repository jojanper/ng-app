define([
    'text!./controllers/templates/playlists.html',
    'text!./controllers/templates/edit.html'
], function (PlaylistsTemplate, PlaylistEditTemplate) {
    "use strict";

    return [
        {
            link: 'playlists',
            display: 'Playlists',
            template: PlaylistsTemplate
        },
        {
            link: 'playlists.edit',
            url: 'edit/:id',
            parent: 'playlists',
            template: PlaylistEditTemplate
        }
    ];
});
