define([
], function () {
    "use strict";

    var name = 'imagelib';

    /**
     * @ngdoc service
     * @name imagelib
     *
     * @description
     * Imaging factory.
     */
    var ImageFactory = function($q) {
        return {
            $$name: name,

            /**
             * @ngdoc
             * @name imagelib#readAsDataURL
             * @methodOf imagelib
             *
             * @description
             * Read contents of specified file. See https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
             * for more details.
             *
             * @param {Object} file File from which to read.
             * @param {Object} $scope Scope object.
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 imagelib.readAsDataURL(file, $scope).then(function(dataUrl) {
                   // Do something with dataUrl
                 });
               </pre>
             */
            readAsDataUrl: function(file, $scope) {
                var deferred = $q.defer();

                var reader = new FileReader();
                reader.onload = function() {
                    $scope.$apply(function() {
                        deferred.resolve(reader.result);
                    });
                };
                reader.readAsDataURL(file);

                return deferred.promise;
            },

            /**
             * @ngdoc
             * @name imagelib#loadImage
             * @methodOf imagelib
             *
             * @description
             * Load speficied image from remote URL.
             *
             * @param {string} imgUrl Image URL.
             * @param {Object} $scope Scope object.
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 var url = https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png;
                 imagelib.loadImage(url, $scope).then(function(imageObj) {
                   // Do something with image object
                 });
               </pre>
             */
            loadImage: function(imgUrl, $scope) {
                var deferred = $q.defer();

                var image = new Image();
                image.onload = function() {
                    $scope.$apply(function() {
                        deferred.resolve(image);
                    });
                };
                image.src = imgUrl;

                return deferred.promise;
            }
        };
    };

    return {
        feature: 'factory',
        name: name,
        cls: ['$q', ImageFactory]
    };
});
