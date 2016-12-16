define([], function () {
    "use strict";

    function uploadAction($scope, $attrs, dialog, uploadUrl) {
        var uploadHtml = '<file-upload layout="dropbox" upload-api="' + uploadUrl + '"' +
                'model="' + $attrs.model + '" file-form-data-name="file"></file-upload>';

        // Enable upload as action menu item
        return [
            {
                text: 'Upload media',
                callback: function() {
                    dialog.showInlineTemplateDialog($scope, uploadHtml, {size: 'lg-80'});
                }
            }
        ];
    }

    // Form template for creating new model item
    var html = '<app-form no-cancel submit-label="Send" clear-label="Reset" name="modelCreateForm" model="modelData" ' +
            'submit-fn="submit(data,url,success)" in-dialog></app-form>';

    /**
     * @ngdoc directive
     * @name actionsMenu
     * @restrict E
     *
     * @description
     * Show available actions associated with a model.
     *
     * @param {string} title Title for the menu.
     * @param {string} model Name of model the menu is associated with.
     * @param {string} actionsMode Actions mode. Currently supported modes:
     *
     *   * create: Only one action as described by 'action' attribute is made available via the menu.
     * The action itself must be supported by the model.
     * @param {string} action Name of (comma separated) action(s) to be made available via the menu.
     */
    var ActionsMenu = function (dialog, appUrlResolver, appMessagesService, rest) {
        return {
            restrict: 'E',
            template: '<menu-dropdown no-check-status style="margin-left: 5px; float: right;" ng-show="ready" ' +
                'title="{{ title }}" auto-close="always" menu-items="actionItems"></menu-dropdown>',

            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                $scope.ready = false;
                $scope.modelData = null;

                $scope.initializeAction = function() {

                    // Menu contains only one action which creates new model item
                    if ($attrs.actionsMode === 'create') {

                        // Action item launches file upload view
                        if ($attrs.action === 'upload') {
                            $scope.actionItems = uploadAction($scope, $attrs, dialog, backendConfig.urls.upload);
                            $scope.ready = true;
                        }

                        // Action item launches wizard for creating new model item
                        else {

                            /*
                             * Make sure the actual create action is supported. The name of the create action
                             * does not necessarily need to be named as 'create'.
                             */
                            appUrlResolver.actionUrl($attrs.model, $attrs.action).then(function(actionData) {

                                // Create action as menu item
                                $scope.actionItems = [
                                    {
                                        /*jshint camelcase: false */
                                        text: actionData.data.display_name,
                                        /*jshint camelcase: true */
                                        callback: function() {
                                            // Show form when user clicks the create action
                                            dialog.showInlineTemplateDialog($scope, html);
                                        }
                                    }
                                ];

                                // Construct model item
                                rest.getModelMeta($attrs.model, actionData.url, function(modelObj) {
                                    $scope.modelData = modelObj;

                                    // Menu can now be shown
                                    $scope.ready = true;
                                });

                            }, function(msg) {
                                appMessagesService.addMessage({type: "error", msgBody: msg});
                            });

                            // Submit data to remote to create new model item
                            $scope.submit = function(data, url, success) {
                                rest.submitData(data, url, $scope, $scope.modelData, true, success);
                            };
                        }
                    }
                };
            }],
            link: function($scope, $element, $attrs) {
                $scope.title = $attrs.title || 'Actions';

                // All values have been evaluated now, initialize the component
                $scope.initializeAction();
            }
        };
    };

    return {
        feature: 'directive',
        name: 'actionsMenu',
        cls: ['dialog', 'appUrlResolver', 'appMessagesService', 'rest', ActionsMenu]
    };
});
