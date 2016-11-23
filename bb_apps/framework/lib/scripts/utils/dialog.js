/**
 * @fileOverview Generic dialog for Draal Media.
 * @author <a href="mailto:juha.ojanpera@gmail.com">Juha Ojanpera</a>
 * @version 0.1
 */
define(['underscore',
        'backbone',
        'jquery',
        'jquery.ui',
        '../base/baseview'],
function(_, Backbone, $, jQueryUI, BaseView) {

    /**
     * Draal dialog.
     * @class
     */
    var MediaDialog = (function () {

        /**
         * Private constructor.
         * @memberof MediaDialog
         * @instance
         * @param {string} idEl Element ID; which element the dialog should be appended to.
         * @param {Dictionary} texts Input for the dialog. Available options :
         * <br/>title : Title text for the dialog (default is empty string)
         * <br/>message : Dialog container message (default is empty container)
         * @returns {Object} Instance of MediaDialog.
         */
        var _MediaDialog = function(idEl, texts) {
            var idElForDialog, settings;

            settings = $.extend({
                title: '',
                message: '',
            }, texts);

            idElForDialog = $(idEl).attr('id') + '_dialog';
            /**
             * Element ID of the dialog.
             * @private
             * @type string
             */
            this.id = '#' + idElForDialog;

            /**
             * Dialog object. Create container for the dialog and attach the message into it
             * @private
             * @type Object
             */
            this.idElForDialog = $('<div/>', {
                'id': idElForDialog,
                'title': settings['title'],
                'css': {
                    'display': 'none',
                    'font-size': '14px',
                },
                'html': settings['message'],
            }).appendTo($(idEl));
        },

        /**
         * Launches the dialog.
         * @memberof MediaDialog
         * @private
         * @instance
         * @param {Dictionary} buttonSettings Buttons for the dialog + function to call
         * @param {Dictionary} callbacks Callback functions, currently only 'close' callback
         * @param {Dictionary} dialogSettings Settings for the dialog. Following options are supported :
         * <br/>show : default is 'fade'
         * <br/>autoOpen : default is false
         * <br/>modal : default is true
         * <br/>resizable : default is false
         * <br/>width : default is 'auto'
         * <br/>overlay: This has two sub-options :
         * <br/>  background : default is '#000'
         * <br/>  opacity : default is '0.5'
         * @example
         * <pre class=prettyprint>
         * Dialog with 'Save' button and callback function :
         * <br/>buttonSettings['Save'] = {'callback': function() {
         *     console.log('Save dialog button was pressed');
         * }};
         * <br/>
         * Callback function :
         * <br/>var callbacks = {};
         * callbacks['close'] = function() {
         *      console.log('Closing dialog');
         * };
         * </pre>
         */
        _launch = function(buttonSettings, callbacks, dialogSettings) {
            var dialogButtons, noCancel, self;

            self = this;

            // shorthand method for if undefined then () ...
            callbacks = callbacks || {'close': function() {} };

            noCancel = false;
            dialogButtons = {};
            if (buttonSettings == undefined || buttonSettings.length == 0) {
                noCancel = true;
                buttonSettings = {};
                buttonSettings['OK'] = function() {
                    _close.call(self, this, callbacks);
                };
            }

            for (var key in buttonSettings) {
                var bsettings = buttonSettings[key];
                dialogButtons[key] = function () {
                    if (bsettings.hasOwnProperty('callback')) {
                        bsettings['callback'](this);
                    }
                    _close.call(self, this, callbacks);
                }
            }

            if (noCancel == false) {
                dialogButtons['Close'] = function () {
                    _close.call(self, this, callbacks);
                }
            }

            // These settings can be customized
            var settings = $.extend({
                show: 'fade',
                autoOpen: false,
                modal: true,
                resizable: false,
                width: 'auto',
                overlay: {
                    background: '#000',
                    opacity: '0.5',
                },
                position: {
                    my: "center", at: "center", of: window
                },
            }, dialogSettings);

            // And these are fixed
            settings = $.extend({
                buttons: dialogButtons,
                open: function() {
                    $("div.ui-dialog " + self.id).not(':first').remove();
                },
                close: function () {
                    _close.call(self, this, callbacks);
                },
                create: function(event, ui)
                {
                    // Here we can apply unique styling
                    $(this).parents(".ui-dialog").css("font-size", '12px');
                    $(this).parents(".ui-dialog-buttonpane").css("font-size", '12px');
                    $(this).parents(".ui-dialog-titlebar").css("font-size", '12px');
                },
            }, settings);

            // Create the dialog
            this.idElForDialog.dialog(settings);

            // Launch the dialog
            this.idElForDialog.dialog("open");

            // Set the overlay for the dialog
            var css = settings['overlay'];
            var overlay = $(".ui-widget-overlay");
            overlay.css("background", css['background']).css("opacity", css['opacity']);
        },

        /**
         * Closes the dialog.
         * @memberof MediaDialog
         * @private
         * @instance
         * @param {Object} dialog Dialog object
         * @param {Dictionary} callbacks Callback functions, currently only 'close' callback
         * is supported.
         * @see MediaDialog#_launch
         */
        _close = function(dialog, callbacks) {
            if (callbacks !== undefined) {
                if (callbacks.hasOwnProperty('close')) {
                    callbacks['close'](dialog);
                }
            }

            if (dialog === undefined) {
                dialog = this.idElForDialog;
            }

            $(dialog).dialog('destroy').remove();
            $(dialog).remove();
        };

        /**
         * Public prototypes.
         * @public
         */
        _MediaDialog.prototype = {
            /**
             * Public constructor.
             * @memberOf MediaDialog
             * @public
             * @instance
             * @see MediaDialog#_MediaDialog
             */
            constructor: _MediaDialog,

            /**
             * Launch the dialog.
             * @memberOf MediaDialog
             * @public
             * @instance
             * @see MediaDialog#_launch
             */
            launch: _launch,

            /**
             * Close the dialog.
             * @memberOf MediaDialog
             * @public
             * @instance
             * @see MediaDialog#_close
             */
            close: _close,

            /**
             * Return ID of the dialog element.
             * @memberOf MediaDialog
             * @public
             * @instance
             */
            id_dialog: function() { return this.id; },
        };

        return _MediaDialog;

    }) ();

    /**
     * Dialog view.
     */
    return BaseView.extend({

        /**
         * All dialogs use this as parent element. Should be present in HTML page.
         */
        dialogId: '#app-dialog',

        /*
         * Default dialog rendeding settings. Can be overwritten via class options.
         */
        defaultSettings: {
            show: false,
            dialogClass: "no-close" // close button in dialog header no visible
        },

        initialize: function(options) {
            this.subViews = {};
            this.options = options || {};
        },

        /**
         * Launch dialog.
         * @param {Object} content Dialog content using 'title' and 'message' properties
         * @param {Object} buttons Buttons specification for the dialog. The callbacks for when
         *                         the associated button is clicked is given with 'callback' property.
         * @param {Object} callbacks Callbacks after dialog has been closed, if any. Currently
         *                           only 'close' property is supported.
         */
        launchDialog: function(content, buttons, callbacks) {
            var _buttons = buttons || {};
            var _callbacks = callbacks || {};
            var defaultSettings = $.extend({}, this.defaultSettings, this.options.dialogOptions);

            this.dialog = new MediaDialog(this.dialogId, content);
            this.dialog.launch(_buttons, _callbacks, defaultSettings);

            return this;
        },

    }, {_id: 'Dialog'});
});
