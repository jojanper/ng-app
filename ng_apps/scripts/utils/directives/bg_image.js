define([
    'jquery'
], function ($) {
    "use strict";

    /**
     * @ngdoc directive
     * @name draalBgImage
     * @restrict A
     *
     * @description
     * Background image loader. Attaches specified image URL as background image to element.
     *
     * @param {string} draalBgImage Image URL to attach to element as background image.
     *
     * @example
       <example>
         <file name="index.html">
           <div draal-bg-image="/img/bg.png"></div>
         </file>
       </example>
     */
    var BgImage = function (imagelib) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var url = $attrs.draalBgImage;

                // Load speficied background image
                imagelib.loadImage(url, $scope).then(function(img) {
                    var scale = "cover"; // 100% auto, contain, cover

                    // On success, attach the image as background image to element
                    $element.css({
                        'backgroundImage': $.sprintf('url("%s")', url),
                        '-webkit-background-size': scale,
                        '-moz-background-size': scale,
                        'background-size': scale,
                        'background-repeat': 'no-repeat',
                        'background-position': "center top",
                        'transition': ''
                    }).fadeIn(1000);
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'draalBgImage',
        cls: ['imagelib', BgImage]
    };
});
