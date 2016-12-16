/**
 * @description
 * MediaType directive for showing media type as icon.
 *
 * @example
   <media-type type="audio"></media-type>
 *
 * # Scope:
 *
 *   * `'type'`: Media type (known media types - audio, video, image)
 */
define([], function () {
    "use strict";

    /*
     * Following integer to media mapping is also supported.
     */
    var intToMediaMappings = {
        '0': 'audio',
        '1': 'image',
        '2': 'video'
    };

    /*
     * Insert these icons for supported media types.
     */
    var mediaMappings = {
        'audio': '<img title="Media contains audio" src="/static/img/icons/music.png">',
        'image': '<img title="Media contains image(s)" src="/static/img/icons/photos.png">',
        'video': '<img title="Media contains video(s)" src="/static/img/icons/videos.png">'
    };

    var MediaType = function() {
        return {
            restrict : 'E',
            link: function(scope, element, attrs) {
                var type = scope.type;
                if (intToMediaMappings[type]) {
                    type = intToMediaMappings[type];
                }

                var html = mediaMappings[type];
                if (html) {
                    element.html(html);
                }
            },
            scope: {
                type: "@"
            }
        };
    };

    return {
        feature: 'directive',
        name: 'mediaType',
        cls: MediaType
    };
});
