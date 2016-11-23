define([
    'angular',
    'text!./templates/dialog.html'
], function (ng, DialogTemplate) {
    "use strict";

    /**
     * @ngdoc service
     * @name dialog
     *
     * @description
     * Dialog factory using Angular UI Bootstrap modal directive.
     */
    var DialogFactory = function($uibModal, $compile) {
        var modalDefaults = {
            /*
             * Controls presence of a backdrop. Allowed values: true (default), false (no backdrop),
             * 'static' - backdrop is present but modal window is not closed when clicking outside
             * of the modal window.
             */
            backdrop: true,

            /*
             * Indicates whether the dialog should be closable by hitting the ESC key, defaults to true
             */
            keyboard: true,

            /*
             * Optional suffix of modal window class. The value used is appended to the modal- class,
             * i.e. a value of sm gives modal-sm
             */
            size: '',

            modalFade: true,
            windowClass: 'modal',
            template: DialogTemplate
        };

        var modalOptions = {
            closeButtonText: '',
            actionButtonText: '',
            headerText: '',
            bodyText: '',
            bodyTemplate: null,
            inlineTemplate: false
        };

        function showDialog(customModalDefaults, customModalOptions) {
            // Create temp objects to work with
            var tempModalDefaults = {};
            var tempModalOptions = {};

            // Map angular-ui modal custom defaults to modal defaults
            ng.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            // Map modal.html $scope custom properties to defaults
            ng.extend(tempModalOptions, modalOptions, customModalOptions);

            // Attach the inline template to the dialog template
            if (tempModalOptions.inlineTemplate) {
                tempModalDefaults.template = tempModalDefaults.template.replace('[[TEMPLATE]]', tempModalOptions.bodyTemplate);
            }

            tempModalDefaults.controller = ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                $scope.modalOptions = tempModalOptions;

                // Root scope will hold the modal scope
                $scope.$root.$dialog = $scope;

                $scope.ok = function (result) {
                    $uibModalInstance.close(result);
                };

                $scope.close = function (result) {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.templateUrl = function() {
                    return $scope.modalOptions.bodyTemplate;
                };
            }];

            // Return a promise that is resolved when a modal is closed and rejected when a modal is dismissed
            return $uibModal.open(tempModalDefaults).result;
        }

        return {
            $$name: 'dialog',

            /**
             * @ngdoc
             * @name dialog#showModal
             * @methodOf dialog
             *
             * @description
             * Launch dialog where dialog layout is fully customizable.
             *
             * @param {Object=} customModalDefaults Dialog modal windows options. For full list of options,
             * see {@link https://angular-ui.github.io/bootstrap/#/modal UI Bootstrap Modal options}
             * @param {Object=} customModalOptions Dialog creation options.
             * @param {string=} customModalOptions.closeButtonText Text for dialog close button.
             * @param {string=} customModalOptions.actionButtonText Text for dialog success button.
             * @param {string=} customModalOptions.headerText Text for dialog header.
             * @param {string=} customModalOptions.bodyText Dialog body content.
             * @param {string=} customModalOptions.bodyTemplate Body template either as HTML markup or template URL.
             * If in markup format, `inlineTemplate` should be set to true.
             * @param {boolean=} customModalOptions.inlineTemplate If true, `bodyTemplate` should be shown as inline template.
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 var customModalDefaults = {};
                 var customModalOptions = {};
                 dialog.showModal(customModalDefaults, customModalOptions);
               </pre>
             */
            showModal: function (customModalDefaults, customModalOptions) {
                var defaultOptions = ng.extend({}, customModalDefaults || {});
                return showDialog(defaultOptions, customModalOptions);
            },

            /**
             * @ngdoc
             * @name dialog#showTextDialog
             * @methodOf dialog
             *
             * @description
             * Launch dialog where dialog body is defined as simple text or HTML markup.
             *
             * @param {Object} customModalOptions Dialog creation options.
             * @param {string=} customModalOptions.closeButtonText Text for dialog close button.
             * @param {string=} customModalOptions.actionButtonText Text for dialog success button.
             * @param {string=} customModalOptions.headerText Text for dialog header.
             * @param {string=} customModalOptions.bodyText Dialog body content.
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 dialog.showTextDialog({
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Customer',
                    headerText: 'Delete ?',
                    bodyText: 'Are you sure you want to delete this customer?'
                 });
               </pre>
             */
            showTextDialog: function (customModalOptions) {
                return showDialog({}, ng.extend({}, customModalOptions, {bodyTemplate: null}));
            },

            /**
             * @ngdoc
             * @name dialog#showTemplateDialog
             * @methodOf dialog
             *
             * @description
             * Launch dialog where body is defined as HTML template URL.
             *
             * @param {Object} $scope Scope object.
             * @param {string} templateUrl Template URL.
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 dialog.showTemplateDialog($scope, 'ng-templates/test.html');
               </pre>
             */
            showTemplateDialog: function ($scope, templateUrl) {
                var modalOptions = {bodyTemplate: templateUrl};
                return showDialog({scope: $scope}, modalOptions);
            },

            /**
             * @ngdoc
             * @name dialog#showInlineTemplateDialog
             * @methodOf dialog
             *
             * @description
             * Launch dialog where body is defined as inline HTML template.
             *
             * @param {Object} $scope Scope object.
             * @param {string} inlineTemplate HTML template.
             * @param {Object=} defaults Dialog modal windows options. For full list of options,
             * see {@link https://angular-ui.github.io/bootstrap/#/modal UI Bootstrap Modal options}
             * @return {Object} Promise object.
             *
             * @example
               <pre>
                 var html = '<app-form name="appForm" model="model"</app-form>';
                 dialog.showInlineTemplateDialog($scope, html);
               </pre>
             */
            showInlineTemplateDialog: function ($scope, inlineTemplate, defaults) {
                var modalOptions = {bodyTemplate: inlineTemplate, inlineTemplate: true};
                var modalDefaults = ng.extend({scope: $scope}, defaults);
                return showDialog(modalDefaults, modalOptions);
            }
        };
    };

    return {
        feature: 'factory',
        name: 'dialog',
        cls: ['$uibModal', '$compile', DialogFactory]
    };
});
