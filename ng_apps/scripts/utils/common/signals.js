define([
    'common/toolbox'
], function (Toolbox) {
    "use strict";

    var BaseSignal = Toolbox.BaseClass.extend({
        name: null,

        constructor: function(context, data) {
            this.context = context;
            this.data = data;
            this.initialize();
        },

        initialize: function() {
        }
    });

    return {
        'visibility': {
            name: 'visibility',
            cls: BaseSignal
        },
        'visibilityFlush': {
            name: 'visibility-flush',
            cls: BaseSignal
        },
        tableReload: {
            name: 'table-reload',
            cls: BaseSignal
        },
        closeDialog: {
            name: 'close-dialog',
            cls: BaseSignal
        },
        uploadFilesChanged: {
            name: 'upload-files-changed',
            cls: BaseSignal
        },
        loader: {
            name: 'data-loader',
            cls: BaseSignal
        }
    };
});
