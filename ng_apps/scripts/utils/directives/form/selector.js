define([
    'angular',
    './base_input',
    'common/html',
    'text!./templates/selector.html',
    'text!./templates/multi-selector.html'
], function (ng, BaseInput, HtmlLib, SelectorTemplate, MultiSelectorTemplate) {
    "use strict";

    // Template for view only rendering
    var viewOnlyHtml = '<div class="form-control view-only-control" ng-bind-html="getViewValue([[modelRef]])"></div>';

    var BaseSelectorInput = BaseInput.extend({

        modelOptions: {
            /*
             * Integer value which contains the debounce model update value in milliseconds.
             * A value of 0 triggers an immediate update.
             */
            debounce: 500
        },

        initialize: function() {
            this.placeholder = this.options.placeholder || 'Select...';
            this.selectKey = (this.options.selector) ? this.options.selector.selectKey || 'id' : 'id';
            this.displayKey = (this.options.selector) ? this.options.selector.displayKey || 'id' : 'id';
            this.selectorRef = (this.options.selector) ? this.options.selector.selectorRef || null : null;
            this.selectorList = (this.options.selector) ? this.options.selector.selectorList || null : null;
            this.selectorUrl = (this.options.selector) ? this.options.selector.url || null : null;
            this.renderType = (this.options.selector) ? this.options.selector.type || null : null;
        },

        /**
         * Selection list has been loaded from server and any post-processing steps should be implemented here.
         *
         * @param {Array} selections Selection list.
         */
        _selectorListLoaded: function(selections) {
        },

        /**
         * Locate selection list from scope tree. Start from current scope object and move towards root
         * scope object via parent scope.
         *
         * @param {Object} $scopes Scope object.
         */
        _locateSelectorList: function($scope) {
            var listRef = '';
            var hasSelection = false;

            var _$scope = $scope;
            while(_$scope) {
                /*
                 * Is list available as defined in the input settings ('selectorRef' defines the name
                 * of attribute that contains the selection list in the scope).
                 */
                if (this.selectorRef && _$scope[this.selectorRef]) {
                    hasSelection = true;
                    listRef += this.selectorRef;
                    break;
                }
                /*
                 * Is list available as key item in 'selections' object ('selectorRef' defines the key name
                 * within 'selections' object that contains the selection list).
                 */
                else if (_$scope.selections && this.selectorRef && _$scope.selections[this.selectorRef]) {
                    hasSelection = true;
                    listRef += 'selections["' + this.selectorRef + '"]';
                    break;
                }
                /*
                 * Is list available as key item in 'selections' object (now the input name defines the key name
                 * within 'selections' object that contains the selection list).
                 */
                else if (_$scope.selections && _$scope.selections[this.options.name]) {
                    hasSelection = true;
                    listRef += 'selections["' + this.options.name + '"]';
                    break;
                }

                // Move to parent object in next iteration
                _$scope = _$scope.$eval('$parent');
                listRef += '$parent.';
            }

            return (hasSelection) ? listRef : null;
        },

        _baseController: function($scope) {
            var listRef;
            var self = this;

            $scope.ngModelOptions = ng.extend({}, this.getNgModelOptions());

            // List is available via URL, load the data from server
            if (this.selectorUrl && !this.options.$form.viewOnly) {
                $scope.$selections = [];

                // Determine target URL, set model ID if needed
                var url = this.selectorUrl.replace('<model-id>', $scope.model.id);
                url = url + '?fields=id,' + this.displayKey;

                // Load the items
                $scope.$root.network.get(url).then(function(data) {
                    $scope.$selections = data;
                    self._selectorListLoaded($scope.$selections);
                });
            }

            // List is available in options directly
            else if (this.selectorList) {
                $scope.$selections = this.selectorList;
            }
            else {
                // Locate and load the selection list from $scope tree
                listRef = this._locateSelectorList($scope);
                if (listRef) {
                    $scope.$selections = $scope.$eval(listRef);
                }

                if (!$scope.$selections) {
                    $scope.$selections = [];
                }
            }

            $scope.placeholder = this.placeholder;

            $scope.getSelections = function() {
                return $scope.$selections;
            };
        }
    });

    var SelectorInput = BaseSelectorInput.extend({
        type: 'selector',
        template: function() {
            return (this.options.$form.viewOnly) ? viewOnlyHtml : SelectorTemplate;
        },

        controller: function($scope) {
            var self = this;

            this._baseController($scope);

            $scope.getViewValue = function(item) {
                var value = (item) ? Object.resolveKey(item, self.displayKey) : null;

                // Selected item should be rendered as image
                if (value && self.renderType === 'image') {
                    value = HtmlLib.img('', {
                        src: value
                    });
                }

                return value;
            };

            /*
             * For single selection the selected item is set using the on-select event.
             * This is to make sure that selected item is accepted when user types first
             * search keyword and then selects the item either using mouse or pressing enter.
             */
            $scope.onChange = function($item, $model) {
                self.setModelValue($scope, $item);

                // Callback exists in options for changes in selection(s)
                if (self.options.onChange) {
                    self.options.onChange($item);
                }
            };
        }
    });

    var MultiSelectorInput = BaseSelectorInput.extend({
        type: 'multiSelector',
        template: function() {
            return (this.options.$form.viewOnly) ? viewOnlyHtml : MultiSelectorTemplate;
        },
        fieldReset: [],

        initialize: function() {
            BaseSelectorInput.prototype.initialize.call(this);

            // If required validator enabled, convert that to multiRequired validator
            if (this.options.validators && this.options.validators.indexOf('required') > -1) {
                this.options.validators = this.options.validators.filter(function(value) {
                    return value !== 'required';
                });
                this.options.validators.push('multiRequired');
            }
        },

        _selectorListLoaded: function(selections) {
            this._initSelected(this.$scope);
        },

        /**
         * Match the selected items with the selection list.
         *
         * @param {Object} model Model object.
         * @param {List} selections Selection list.
         *
         * @returns {List} Selected items for the model.
         */
        _copyRefMatches: function(modelData, selections) {
            var j, data = [];

            /*
             * If selection list not yet available, copy the model data as selection list to make
             * sure that selected model data is shown correctly even though actual selection list is
             * not yet available.
             */
            if (selections.length === 0) {
                selections = ng.copy(modelData);
            }

            for (j = 0; j < modelData.length; j++) {
                for (var i = 0; i < selections.length; i++) {
                    if (Object.resolveKey(modelData[j], this.selectKey) === Object.resolveKey(selections[i], this.selectKey)) {
                        data.push(selections[i]);
                        break;
                    }
                }
            }

            return data;
        },

        /**
         * Initialize selected items in the model.
         */
        _initSelected: function($scope) {
            var modelData = this.getModelValue($scope);
            if (Array.isArray(modelData) && modelData.length > 0) {
                var data = this._copyRefMatches(modelData, $scope.$selections);
                this.setModelValue($scope, data);
            }
        },

        controller: function($scope) {
            var self = this;

            this.$scope = $scope;

            this._baseController($scope);
            this._initSelected($scope);

            $scope.getViewValue = function(item) {
                if (self.options.$form.viewOnly) {
                    var html = [];
                    item.forEach(function(obj, index) {
                        html.push(obj[self.displayKey]);
                    });

                    return html.join(',');
                }

                return (item) ? item[self.displayKey] : [];
            };

            // Callback exists in options for changes in selection(s)
            if (self.options.onChange) {
                $scope.onChange = function($item, $model) {
                    self.options.onChange($item);
                };
            };
        },

        _customErrors: function($scope) {
            // Errors from parent, if any
            var errors = BaseSelectorInput.prototype._customErrors.call(this, $scope);

            var modelData = this.getModelValue($scope);

            // Minimum amount of items must be selected
            if (this.options.selector.minItems) {
                if (modelData.length < this.options.selector.minItems) {
                    errors.push('At least ' + this.options.selector.minItems + ' items must be selected');
                }
            }

            // Maximum limit exists for the selected items
            if (this.options.selector.maxItems) {
                if (modelData.length > this.options.selector.maxItems) {
                    errors.push('Max ' + this.options.selector.maxItems + ' items can be selected');
                }
            }

            return errors;
        }
    });

    return [SelectorInput, MultiSelectorInput];
});
