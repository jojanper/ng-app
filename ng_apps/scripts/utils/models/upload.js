/**
 * File model.
 */
define([
    'angular',
    'utils/models/model'
], function (ng, BaseModel) {
    "use strict";

    var FileModel = BaseModel.extend({

        setInitData: function() {
            this.file = null;

            this.$types = {
                file: {
                    type: "file",
                    label: "Attach content (drag & drop supported)",
                    dragDrop: true
                }
            };

            this.$order = ['file'];
        },

        /**
         * Determine if inclusion of multiple files to the model is allowed.
         *
         * @return {boolean} true if multiple files are allowed, false otherwise.
         */
        multipleFiles: function() {
            return this.options.multiple === true;
        }
    });

    return FileModel;
});
