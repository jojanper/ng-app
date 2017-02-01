define([
    'jquery',
    'angular',
    './form/form_input',
    'common/html',
    'common/utils',
    'text!./templates/form_header.html'
], function ($, ng, FormInput, htmlLib, UtilsLib, FormTemplate) {
    "use strict";

    function getAttrValue(attrs, name, defaultValue) {
        if (attrs.hasOwnProperty(name)) {
            return attrs[name];
        }

        return defaultValue;
    }

    var defaultName = 'appForm';

    /**
     * Generate HTML for the form input.
     */
    function appInput(options, $scope) {
        var html, _options = ng.extend({}, options, {formName: $scope.name});

        html = '<app-input options="' + encodeURIComponent(ng.toJson(_options)) + '"';
        html += ' model="model"';
        if ($scope.noLabel) {
            html += ' no-label';
        }

        // Global noModelOptions to all input descendants
        html += ' ng-model-options="{debounce: {default: 300, blur: 0}}"';

        html += '><div class="app-input"></div></app-input>';

        return html;
    }

    /**
     * @ngdoc directive
     * @name appForm
     * @restrict E
     *
     * @description
     * Model data representation as HTML form.
     *
     * @param {string} model Model as assignable angular expression.
     * @param {string=} submitFn Submit callback function as assignable angular expression.
     *
     * @param {string=} name Name of form.
     * @param {string=} [submitLabel=Submit] Name of submit button.
     * @param {string=} clearLabel Name of clear button (which clears form data). If not present, no clear button is rendered.
     *
     * @param {string=} submitTitle Tooltip text for submit button.
     * @param {string=} clearTitle Tooltip text for clear button.
     * @param {string=} editTitle Tooltip text for edit button.
     * @param {string=} cancelTitle Tooltip text for cancellation button.
     *
     * @param {string=} inDialog Form is rendered inside dialog.
     *
     * @param {string=} noStatus Do not show form status (invalid, modified, etc).
     * @param {string=} noLabel Do not show label for inputs.
     * @param {string=} noEdit Form is rendered to edit mode directly.
     * @param {string=} noCancel No possibility to cancel changed values. When cancel button is pressed, any changes made to
     * inputs are cancelled and form is rendered back to view only mode.
     *
     * @param {boolean=} [readOnly=false] Form inputs are rendered in read only mode. Edit mode is enabled via edit button.
     * @param {boolean=} [viewOnly=false] Form inputs are rendered in view only mode. Form cannot be converted into editable.
     *
     * @example
       <example>
         <file name="index.html">
           <app-form name="myform" model="model"></app-form>
         </file>
       </example>
     */
    var AppForm = function ($compile) {

        return {
            /**
             * Generate the form template (without inputs).
             */
            template: function(tElem, tAttrs) {
                var html = '';
                var innerHtml = FormTemplate;
                var name = tAttrs.name || defaultName;

                // Submit button
                if (!tAttrs.hasOwnProperty('noSubmit')) {
                    html += htmlLib.button(tAttrs.submitLabel || 'Submit', {
                        class: 'draal-button-md',
                        'ng-click': 'submit(' + name + ')',
                        'ng-show': "!readOnly && canSubmit()",
                        'uib-tooltip': getAttrValue(tAttrs, 'submitTitle', 'Save changed items'),
                        'tooltip-animation': "false",

                        // Submit not allowed when invalid form
                        'ng-disabled': "!canSubmit()"
                    });
                }

                // Form clear/reset button
                if (tAttrs.clearLabel) {
                    html += ' ' + htmlLib.button(tAttrs.clearLabel, {
                        class: 'draal-button-md',
                        'ng-click': 'clear()',
                        'ng-disabled': "readOnly",
                        'ng-show': "!readOnly",
                        'uib-tooltip': getAttrValue(tAttrs, 'clearTitle', 'Clear all items'),
                        'tooltip-animation': "false"
                    });
                }

                // Turn form into editable mode
                if (!tAttrs.hasOwnProperty('noEdit') && !tAttrs.hasOwnProperty('viewOnly')) {
                    html += ' ' + htmlLib.button('Edit', {
                        class: 'draal-button-md',
                        'ng-click': 'edit()',
                        'ng-show': "readOnly",
                        'uib-tooltip': getAttrValue(tAttrs, 'editTitle', 'Edit the items'),
                        'tooltip-animation': "false"
                    });
                }

                // Cancel any changes made to form and go back to non-editable mode
                if (!tAttrs.hasOwnProperty('noCancel')) {
                    html += ' ' + htmlLib.button('Cancel', {
                        class: 'draal-button-md',
                        'ng-click': 'cancel()',
                        'ng-show': "!readOnly",
                        'uib-tooltip': getAttrValue(tAttrs, 'cancelTitle', 'Back to non-editable view'),
                        'tooltip-animation': "false"
                    });
                }

                // Embed the buttons inside the main template
                innerHtml = innerHtml.replace('[[FORM_BOTTOM]]', html);

                return htmlLib.form(innerHtml, {
                    name: name,
                    role: 'form',
                    novalidate: ''
                });
            },
            restrict: 'E',
            transclude: 'true',
            scope: {
                model: '=',
                submitFn: '&'
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var inDialog = $attrs.hasOwnProperty('inDialog');

                $scope.modelSaveFields = [];
                $scope.modelAllFields = [];

                $scope.name = $attrs.name || defaultName;
                $scope.formTitle = $attrs.formTitle;
                $scope.noStatus = $attrs.hasOwnProperty('noStatus') ? true : false;
                $scope.noLabel = $attrs.hasOwnProperty('noLabel') ? true : false;
                $scope.readOnly = $attrs.readOnly || false;
                $scope.viewOnly = $scope.$eval($attrs.viewOnly) || false;
                if ($scope.viewOnly) {
                    $scope.readOnly = true;
                    $scope.noStatus = true;
                }

                $scope.modelCopy = ng.copy($scope.model);

                $scope.edit = function() {
                    if ($scope.readOnly) {
                        $scope.readOnly = false;
                    }
                };

                $scope.cancel = function() {
                    $scope.readOnly = true;
                    $scope.model = ng.copy($scope.modelCopy);
                    $scope[$scope.name].$setPristine();
                };

                // Clear form data
                $scope.clear = function() {

                    // Reset only those fields that are part of the form
                    ng.forEach($scope.modelAllFields, function(field) {
                        $scope.model.formReset(field, $scope, FormInput);
                    });
                };

                // Submit valid form data
                $scope.submit = function(form) {
                    // Trigger validation flag.
                    $scope.submitted = true;

                    // Collect the form data
                    var data = {};
                    ng.forEach($scope.modelSaveFields, function(field) {
                        this[field] = $scope.model.getValue(field);
                    }, data);

                    // And call submit method
                    var ret = $scope.submitFn({
                        data: data,
                        url: $scope.model.$postUrl,
                        success: function() {
                            // Close the dialog
                            if (inDialog) {
                                // Alternatively, send close signal
                                //$scope.$emit("close-dialog");

                                $scope.$root.$dialog.close();
                            }

                            // Set form as pristine and read only after submit
                            $scope[$scope.name].$setPristine();
                            $scope.readOnly = true;
                        }
                    });
                };

                // Is form data modified?
                $scope.isModified = function() {
                    return $scope[$scope.name].$dirty;
                };

                // Is form data invalid?
                $scope.isInvalid = function() {
                    return $scope[$scope.name].$invalid;
                };

                // Can form data be submitted?
                $scope.canSubmit = function() {
                    return !$scope.isInvalid() && $scope.isModified();
                };

                // Is input read only?
                $scope.readOnlyInput = function(inputObj) {
                    var status = $scope.readOnly;
                    if (!status) {
                        // Check the input status regarding editability
                        status = (inputObj.options.editable === false) ? true : false;
                    }
                    return status;
                };
            }],
            link: function($scope, $element, $attrs) {
                $scope.$evalAsync(function() {
                    /*
                     * Add input elements only if no transcluded elements are
                     * present within the form already.
                     */
                    if (!$element.find('app-input').length) {
                        var inputElement = $element.find('.form-inputs');

                        /*
                         * Generate HTML for all form inputs.
                         */
                        var html = '';
                        var inputs = $scope.model.getInputs();
                        ng.forEach(inputs, function(value, key) {
                            $scope.modelAllFields.push(value.name);
                            $scope.modelSaveFields.uniquePush(value.name.inputFieldName());
                            html += appInput(value, $scope);
                        });

                        // And attach the inputs to the form
                        inputElement.html(html);
                        $compile(inputElement.contents())($scope);
                    }
                    else {
                        ng.forEach($element.find('app-input'), function(element) {
                            var ref = $(element).attr('ref').toString();
                            $scope.modelAllFields.push(ref);
                            $scope.modelSaveFields.uniquePush(ref.inputFieldName());
                        });
                    }
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'appForm',
        cls: ['$compile', AppForm]
    };
});
