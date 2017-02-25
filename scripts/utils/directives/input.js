define([
    'angular',
    './form/form_input'
], function (ng, FormInput) {
    "use strict";

    /**
     * @ngdoc directive
     * @name appInput
     * @restrict E
     *
     * @description
     * Form input modelling.
     *
     * @param {string} model Model as assignable angular expression.
     *
     * @param {string=} options Input options.
     * @param {string=} noLabel Do not show label for input.
     * @param {string=} autoObject If defined, input has been extended from transcluded object input element.
     *
     * @example
       <example>
         <file name="index.html">
           <app-form name="myform" model="model">
             <app-input ref="name"></app-input>
           </app-form>
         </file>
       </example>
     */
    var AppInput = function ($compile, network) {

        return {
            template: '',
            restrict: 'E',
            scope: {
                'model': '='
            },
            require: '^appForm',
            compile: function($element, $attrs) {
                var autoObj = false;

                // autoObject attribute indicates that input has been extended from transcluded object input element
                if ($attrs.hasOwnProperty('autoObject')) {
                    autoObj = true;
                    $attrs.$set("model", "$parent.$parent.model");
                }
                else if ($attrs.model === undefined) {
                    $attrs.$set("model", "$parent.model");
                }

                return {
                    post: function postLink($scope, $element, $attrs) {
                        $scope.$evalAsync(function() {
                            var $form;
                            var options = {};
                            var noLabel = $attrs.hasOwnProperty('noLabel');

                            $scope.$root.network = network;

                            /*
                             * If attributes do not include 'options', then read the
                             * input options from the model using the 'ref' attribute.
                             */
                            if ($attrs.options) {
                                $form = $scope.$parent;
                                options = decodeURIComponent($attrs.options);
                                $scope.options = ng.extend({}, $scope.$eval(options));
                            }
                            else {
                                $form = autoObj ? $scope.$parent.$parent.$parent : $scope.$parent.$parent;

                                /*
                                 * Input is actually transcluded element. Setup the element
                                 * correctly.
                                 */
                                options = ng.extend({}, $scope.model.getFieldOptions($attrs.ref));
                                $scope.options = ng.extend({}, options, $attrs, {
                                    name: $attrs.ref,
                                    manualInput: true,
                                    formName: $scope.$parent.$parent.name || $scope.$parent.$parent.$parent.name
                                });

                                // The actual input is placed inside this element
                                $element.html('<div class="app-input"></div>');

                                // Read label status from form
                                noLabel = noLabel || $scope.$parent.$parent.noLabel;
                            }

                            // No label needed for the input
                            if (noLabel) {
                                $scope.options = ng.extend($scope.options, {noLabel: true});
                            }

                            // Form controller
                            $scope.options.$form = $form;

                            // Generate the HTML corresponding to the input type
                            var inputObj = new FormInput($scope, $scope.options);
                            var inputElement = $element.find('.app-input');
                            inputElement.html(inputObj.toHTML());
                            $compile(inputElement.contents())($scope);
                        });
                    }
                };
            }
        };
    };

    return {
        feature: 'directive',
        name: 'appInput',
        cls: ['$compile', 'network', AppInput]
    };
});
