(function(define, describe) {
    "use strict";

    // Test selection list
    var adminModels = [
        {
            id: 'region',
            description: "Region",
            hide: true
        },
        {
            id: 'country',
            description: "Country"
        },
        {
            id: 'customer',
            description: "Customer"
        },
    ];

    var dependencies = [
        'bootstrap',
        'jquery',
        'apps/test/controllers/test_model',
        'utils/models/upload',
        'utils/models/model',
    ];

    define(dependencies, function(AppBootstrap, $, TestModel, UploadModel, BaseModel) {

        var appName = 'app';

        describe('Form directive', function() {

            beforeEach(module(appName));

            var $rootScope, $compile, $timeout;

            beforeEach(function() {
                inject(function(_$rootScope_, _$compile_, _$timeout_) {
                    $rootScope = _$rootScope_;
                    $compile = _$compile_;
                    $timeout = _$timeout_;
                });
            });

            it('input type has no directives defined', function () {

                // GIVEN no directives and empty validators
                var model = new TestModel();
                model.name2 = 'test me';
                model.$types = angular.extend({}, {
                    name2: {
                        type: "text",
                        label: "Your Name",
                        validators: []
                    }
                });

                // WHEN creating the form
                var element = '<app-form name="testForm" model="testData">' +
                    '<app-input ref="name2"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                });

                // THEN form should be rendered
                expect(obj.$element.find('input').val()).toEqual(model.name2);

                obj.$scope.$destroy();
            });

            it('input supports blacklist values', function () {

                // GIVEN blacklisted name
                var model = new TestModel();
                model.name = 'no-no';
                model.$types.name.directives.push({
                    type: "blacklist",
                    items: ['no-no']
                });

                // WHEN creating the form
                var element = '<app-form name="testForm" model="testData">' +
                    '<app-input ref="name"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                });

                // THEN blacklisted indication should be present
                expect($(obj.$element.find('.label')[5]).text()).toEqual('Value is blacklisted!');

                // ---

                // WHEN input is changed to valid name
                var input = obj.$element.find('input');
                input.val('yes');
                input.trigger('input');

                // THEN value is saved to model
                expect(model.name).toEqual('yes');

                // AND form can be submitted
                expect(obj.$elementScope.canSubmit()).toBeTruthy();

                obj.$scope.$destroy();
            });

            it('supports selector', function() {

                // GIVEN model
                var testSubmitData;
                var model = new TestModel();

                // WHEN creating form with selector input
                var element = '<app-form name="testForm" submit-fn="testSubmit(data)" model="testData">' +
                    '<app-input ref="data"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                    scope.testSubmit = function (data) { testSubmitData = data; };

                    scope.selections = {
                        data: adminModels
                    };
                });

                // THEN selector value should match that of the model
                var el = obj.$element.find('.ui-select-container');
                expect($(obj.$element.find('.ng-scope')[3]).html()).toEqual(model.data.description);

                // ---

                // WHEN opening dropdown selection list
                AppTestUtils.selector.openDropdown(el, obj.$scope);

                // THEN list should contain all items
                var choicesEls = obj.$element.find('.ui-select-choices-row');
                expect(choicesEls.length).toEqual(adminModels.length);

                // ---

                // WHEN selecting item from list
                var itemValue = 'Region';
                AppTestUtils.selector.clickItem(el, itemValue, obj.$scope);

                $timeout(function() {

                     // THEN it should get selected
                     expect($(obj.$element.find('.ui-select-container span')[1]).find('.ng-scope').text()).toEqual(itemValue);
                     expect(model.data.description).toEqual(itemValue);
                 });

                // --

                // WHEN form is submitted
                element = obj.$element.find('button');
                AppTestUtils.ngClick(element[0], obj.$scope);

                $timeout(function() {
                    // THEN selector input should be correct
                    expect(testSubmitData.data).toEqual(itemValue);
                });
            });

            it('selection list ref is defined in options', function() {

                // GIVEN definition for selector in model
                var testSubmitData;
                var model = new TestModel();
                model.list = null;
                model.$types = angular.extend({}, {
                    list: {
                        type: "selector",
                        label: "Test selections",
                        directives: ['required'],
                        placeholder: 'Select test data...',
                        selector: {
                            displayKey: 'description',
                            selectorRef: 'ref'
                        }
                    }
                });

                // WHEN creating form with selector input
                var element = '<app-form name="testForm" submit-fn="testSubmit(data)" model="testData">' +
                    '<app-input ref="list"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                    scope.testSubmit = function (data) { testSubmitData = data; };

                    scope.selections = {
                        ref: adminModels
                    };
                });

                // THEN selector value should be empty
                expect($(obj.$element.find('.ui-select-container span')[1]).find('.ng-scope').text()).toEqual('');

                // AND form is set to invalid
                expect(obj.$elementScope.isInvalid()).toBeTruthy();
                expect(obj.$element.find('.app-form-header span').text()).toEqual('Invalid');

                // ---

                // WHEN opening dropdown selection list
                var el = obj.$element.find('.ui-select-container');
                AppTestUtils.selector.openDropdown(el, obj.$scope);

                // THEN list should contain all items
                var choicesEls = obj.$element.find('.ui-select-choices-row');
                expect(choicesEls.length).toEqual(adminModels.length);

                // ---

                // WHEN selecting item from list
                var itemValue = 'Region';
                AppTestUtils.selector.clickItem(el, itemValue, obj.$scope);

                $timeout(function() {
                    // THEN it should get selected
                    expect($(obj.$element.find('.ui-select-container span')[1]).find('.ng-scope').text()).toEqual(itemValue);
                    expect(model.list.description).toEqual(itemValue);
                });
            });

            it('scope includes selection list', function() {

                // GIVEN selection list that is defined in scope
                var testSubmitData;
                var model = new TestModel();
                model.list = null;
                model.$types = angular.extend({}, {
                    list: {
                        type: "selector",
                        label: "Test selections",
                        directives: ['required'],
                        placeholder: 'Select test data...',
                        selector: {
                            displayKey: 'description',
                            selectorRef: 'ref'
                        }
                    }
                });

                var element = '<app-form name="testForm" submit-fn="testSubmit(data)" model="testData">' +
                    '<app-input ref="list"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                    scope.testSubmit = function (data) { testSubmitData = data; };
                    scope.ref = adminModels;
                });

                // WHEN opening dropdown selection list
                var el = obj.$element.find('.ui-select-container');
                AppTestUtils.selector.openDropdown(el, obj.$scope);

                // THEN list should contain all items
                var choicesEls = obj.$element.find('.ui-select-choices-row');
                expect(choicesEls.length).toEqual(adminModels.length);
            });

            it('supports multiselector with initial values', function() {

                // GIVEN multiselector model definition and initial values
                var testSubmitData;
                var model = new TestModel();
                model.multiList = [adminModels[0]];
                model.$types = angular.extend({}, {
                    multiList: {
                        type: "multiSelector",
                        label: "Test selections",
                        directives: ['required'],
                        placeholder: 'Select test data...',
                        selector: {
                            displayKey: 'description',
                            minItems: 2,
                            maxItems: 2
                        }
                    }
                });

                var element = '<app-form name="testForm" submit-fn="testSubmit(data)" model="testData">' +
                    '<app-input ref="multiList"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = model;
                    scope.testSubmit = function (data) { testSubmitData = data; };

                    scope.selections = {
                        multiList: adminModels
                    };
                });

                // WHEN opening dropdown selection list
                var el = obj.$element.find('.ui-select-container');
                AppTestUtils.selector.openDropdown(el, obj.$scope);

                // THEN list should contain all non-selected items
                var choicesEls = obj.$element.find('.ui-select-choices-row');
                expect(choicesEls.length).toEqual(2);

                // AND error should be present for the input
                expect($(obj.$element.find('span')[2]).html()).toEqual('At least 2 items must be selected');

                // ---

                // WHEN selecting item from list
                var itemValue = 'Country';
                AppTestUtils.selector.clickItem(el, itemValue, obj.$scope);
                $timeout.flush();

                // THEN list should contain valid items
                expect(model.multiList).toEqual([adminModels[0], adminModels[1]]);

                // AND dropdown list should contain only one item for selection
                AppTestUtils.selector.openDropdown(el, obj.$scope);
                choicesEls = obj.$element.find('.ui-select-choices-row');
                expect(choicesEls.length).toEqual(1);

                // ---

                // WHEN further selecting item from list
                itemValue = 'Customer';
                AppTestUtils.selector.clickItem(el, itemValue, obj.$scope);
                $timeout.flush();

                // THEN error should be present
                expect($(obj.$element.find('span')[2]).html()).toEqual('Max 2 items can be selected');
            });
        });

        describe('Form directive attributes', function() {

            beforeEach(module(appName));

            var $scope, $element, testData, $formScope;

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var element =
                    '<app-form form-title="Form name" submit-fn="testSubmit(data)" ' +
                        'submit-label="Send" clear-label="Reset" ' +
                        'no-label model="testData"></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                    scope.testSubmit = function (data) { testData = data; };
                });
                $scope = obj.$scope;
                $element = obj.$element;
                $formScope = obj.$elementScope;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('no-label attribute has been defined for input in form level', function() {

                // GIVEN form has noLabel attribute

                // WHEN locating label for the input
                var inputLabel = $element.find('app-input label');

                // THEN it should be empty
                expect(inputLabel.val()).toEqual('');
            });

            it('form has default name', function() {

                // GIVEN form has no name attribute

                // WHEN locating the name
                var name = $formScope.name;

                // THEN it should be the default name
                expect(name).toEqual('appForm');
            });

            it('supports form-title', function() {

                // GIVEN form has title set

                // WHEN locating the title
                // THEN it should be present
                expect($($element.find('span')[0]).html()).toEqual('Form name');

            });
        });

        describe('Form directive with multiple inputs (auto-inputs)', function() {

            beforeEach(module(appName));

            var $scope, $element;

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var element = '<app-form submit-label="Send" clear-label="Reset" name="testForm" ' +
                        'no-label model="testData" submit-fn="testSubmit(data)"></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                    scope.testSubmit = function (data) { };
                });
                $scope = obj.$scope;
                $element = obj.$element;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                // Inputs must match that of the model inputs
                expect($element.find('app-input').length).toEqual($scope.testData.getInputs().length);
            });

            it('form is reset', function() {
                // GIVEN form inputs

                // WHEN reset button is clicked
                var element = $element.find('button');
                AppTestUtils.ngClick(element[1]);

                // THEN inputs should be reset
                expect($scope.testData.name).toEqual(null);
                expect($scope.testData.email).toEqual(null);
                expect($scope.testData.data).toEqual(null);
                expect($scope.testData.multiData).toEqual([]);
            });

            it('supports no-label', function() {

                // GIVEN form has noLabel attribute

                // WHEN locating label for the input
                var inputLabel = $element.find('app-input label');

                // THEN it should be empty
                expect(inputLabel.val()).toEqual('');
            });
        });

        describe('Form directive with defined input type', function() {

            beforeEach(module(appName));

            var $scope, $element, testData, $formScope;

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var element = '<app-form no-edit submit-fn="testSubmit(data,url,success)" submit-label="Send" clear-label="Reset" ' +
                    'name="testForm" model="testData"><app-input ref="name"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                    scope.testSubmit = function (data, url, success) {
                        testData = data;
                        success();
                    };
                });
                $scope = obj.$scope;
                $element = obj.$element;
                $formScope = obj.$elementScope;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                // GIVEN form HTML

                // WHEN form is rendered

                // THENo nly one input must be present
                expect($element.find('app-input').length).toEqual(1);

                // AND name of input must match the model input
                expect($($element.find('input')).prop('value')).toEqual($scope.testData.name);

                // AND 2 buttons must be available
                var element = $element.find('button');
                expect($(element[0]).text()).toEqual('Send');
                expect($(element[1]).text()).toEqual('Reset');
            });

            it('form is reset', function() {
                // GIVEN form

                // WHEN reset button is clicked
                var element = $element.find('button');
                AppTestUtils.ngClick(element[1]);

                // THEN input should be reset
                expect($scope.testData.name).toEqual(null);
                expect($($element.find('input')).prop('value')).toEqual('');
            });

            it('form input is changed and submit is called', function() {
                // GIVEN form input
                var input = $element.find('input');

                // WHEN form input is changed
                input.val('test');
                input.trigger('input');

                // THEN model value should change
                expect($scope.testData.name).toEqual('test');

                // AND form can be submitted
                expect($formScope.canSubmit()).toBeTruthy();

                // ---

                // WHEN form submit is called
                var element = $element.find('button');
                AppTestUtils.ngClick(element[0]);
                $scope.$digest();

                // THEN submit data is correct
                expect(testData.name).toEqual($scope.testData.name);

                // AND form header labels are cleared
                expect($element.find('.app-form-header span').length).toEqual(0);

                // AND form cannot be submitted
                expect($($element.find('button')[0]).prop('disabled')).toBeTruthy();
                expect($formScope.canSubmit()).toBeFalsy();
            });
        });

        describe('Form directive with non-editable input', function() {

            beforeEach(module(appName));

            var origData;
            var $scope, $element, testData, $formScope;

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var element = '<app-form no-edit submit-fn="testSubmit(data,url,success)" ' +
                    'name="testForm" model="testData"><app-input ref="middlename"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                    origData = scope.testData.middlename;
                    scope.testSubmit = function (data, url, success) {
                        testData = data;
                        success();
                    };
                });
                $scope = obj.$scope;
                $element = obj.$element;
                $formScope = obj.$elementScope;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('form is reset', function() {
                // GIVEN form

                // WHEN reset button is clicked
                var element = $element.find('button');
                AppTestUtils.ngClick(element[1]);

                // THEN non-editable input should remain unchanged
                expect($scope.testData.middlename).toEqual(origData);
                expect($($element.find('input')).prop('value')).toEqual(origData);
            });
        });

        describe('Form directive with invalid input type', function() {

            beforeEach(module(appName));

            var $rootScope, $compile;

            beforeEach(inject(function(_$rootScope_, _$compile_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
            }));

            it('should throw an error', function () {

                // GIVEN invalid input type
                var model = new TestModel();
                model.name2 = 'test me';
                model.$types = angular.extend({}, {
                    name2: {
                        type: "invalid",
                        label: "Your Name",
                        validators: []
                    }
                });

                // WHEN creating the form
                function errorFnWrapper() {
                    var element = '<app-form name="testForm" model="testData">' +
                        '<app-input ref="name2"></app-input></app-form>';

                    AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                        scope.testData = model;
                    });
                }

                // THEN error should be thrown
                expect(errorFnWrapper).toThrow();
            });
        });

        describe('Form with no-submit+edit+cancel attribute', function() {

            beforeEach(module(appName));

            var $scope, $element;

            beforeEach(inject(function($rootScope, $compile) {
                var element = '<app-form no-edit no-submit no-cancel name="testForm" model="testData">' +
                        '<app-input ref="name"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                });
                $scope = obj.$scope;
                $element = obj.$element;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                // No buttons available in the form
                expect($element.find('button').length).toEqual(0);
            });
        });

        describe('Form edit + cancel + submit', function() {

            beforeEach(module(appName));

            var $scope, $element, $formScope, $timeout;

            beforeEach(inject(function($rootScope, $compile, _$timeout_) {
                var element = '<app-form name="testForm" read-only="true" submit-fn="testSubmit(data,url,success)" model="testData">' +
                        '<app-input ref="name"></app-input></app-form>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.testData = new TestModel();
                    scope.testSubmit = function (data, url, success) {
                        success();
                    };
                });
                $scope = obj.$scope;
                $element = obj.$element;
                $formScope = obj.$elementScope;
                $timeout = _$timeout_;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('edit mode is enabled', function() {

                // GIVEN form which has edit, submit and cancel buttons
                // WHEN form is rendered for initial view

                // THEN submit button should be disabled
                expect($($element.find('button')[0]).attr('disabled')).toEqual('disabled');

                // AND edit button should be visible
                expect($($element.find('button')[1]).attr('class')).toEqual('draal-button-md');

                // AND cancel button should be hidden
                expect($($element.find('button')[2]).attr('class')).toEqual('draal-button-md ng-hide');

                // -----

                // WHEN edit button is clicked
                AppTestUtils.ngClick($element.find('button')[1]);

                // THEN submit button should be disabled
                expect($($element.find('button')[0]).attr('disabled')).toEqual('disabled');

                // AND edit button should be hidden
                expect($($element.find('button')[1]).attr('class')).toEqual('draal-button-md ng-hide');

                // AND cancel button should be visible
                expect($($element.find('button')[2]).attr('class')).toEqual('draal-button-md');
            });

            it('edited changes are cancelled', function() {

                // GIVEN editable form
                AppTestUtils.ngClick($element.find('button')[1]);

                // WHEN input value is changed
                var value = 'test';
                var input = $($element.find('input')[0]);
                input.val(value);
                input.trigger('input');
                $timeout.flush();

                // THEN form submit should be possible
                expect($formScope.canSubmit()).toBeTruthy();
                expect($($element.find('button')[0]).attr('class')).toEqual('draal-button-md');

                // AND changed value is updated in model data
                expect($scope.testData.name).toEqual(value);

                // -----

                // WHEN cancel button is clicked
                AppTestUtils.ngClick($element.find('button')[2]);

                // THEN model data is reverted to original
                expect($scope.testData.name).toEqual('jojan');

                // AND submit button is hidden
                expect($($element.find('button')[0]).attr('class')).toEqual('draal-button-md ng-hide');

                // AND edit button is visible
                expect($($element.find('button')[1]).attr('class')).toEqual('draal-button-md');

                // AND cancel button is hidden
                expect($($element.find('button')[2]).attr('class')).toEqual('draal-button-md ng-hide');
            });
        });

        describe('Basemodel + form + selector', function() {

            beforeEach(module(appName));

            var $scope, $element, timeout, onChangeCalled = false;

            beforeEach(inject(function($rootScope, $compile, $timeout) {
                var element = '<app-form no-status no-label name="selectorForm" no-submit model="model">' +
                        '<app-input ref="data"></app-input><app-input ref="multiData"></app-input></app-form>';

                timeout = $timeout;

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.selections = {
                        multiData: adminModels
                    };

                    scope.model = new BaseModel({
                        data: {
                            data: adminModels[0],
                            multiData: []
                        },
                        inputDefs: [
                            {
                                name: 'data',
                                type: "selector",
                                label: "Selections",
                                placeholder: 'Select data...',
                                selector: {
                                    displayKey: 'description',
                                    selectorList: adminModels
                                },
                                onChange: function() {
                                    onChangeCalled = true;
                                }
                            },
                            {
                                name: 'multiData',
                                type: "multiSelector",
                                label: "Selections",
                                placeholder: 'Select data...',
                                selector: {
                                    displayKey: 'description'
                                },
                                onChange: function() {
                                    onChangeCalled = true;
                                }
                            }
                        ]
                    });
                });
                $scope = obj.$scope;
                $element = obj.$element;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('invokes onChange callback on select', function() {

                // GIVEN onChange callback for selector input

                for (var i = 0; i < 2; i++) {

                    // WHEN selecting item from selector list
                    var el = $($element.find('.ui-select-container')[i]);
                    AppTestUtils.selector.openDropdown(el, $scope);
                    var itemValue = 'Country';
                    AppTestUtils.selector.clickItem(el, itemValue, $scope);
                    timeout.flush();

                    // THEN callback function is called
                    expect(onChangeCalled).toBeTruthy();
                    onChangeCalled = false;
                }
            });
        });

        describe('Selector URL', function() {

            beforeEach(module(appName));

            var $scope, $element, timeout;

            beforeEach(inject(function($rootScope, $compile, $timeout, $httpBackend) {
                var element = '<app-form no-status no-label name="selectorForm" no-submit model="model">' +
                        '<app-input ref="data"></app-input></app-form>';

                timeout = $timeout;

                $httpBackend.whenGET('/api/selection-list?fields=id,description')
                    .respond(200, [
                        {
                            id: 'mnc',
                            description: "MNC"
                        },
                        {
                            id: 'mcc',
                            description: "MCC"
                        }
                    ]);

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.model = new BaseModel({
                        data: {
                            data: adminModels[0]
                        },
                        inputDefs: [
                            {
                                name: 'data',
                                type: "selector",
                                label: "Selections",
                                placeholder: 'Select data...',
                                selector: {
                                    displayKey: 'description',
                                    url: '/api/selection-list'
                                }
                            }
                        ]
                    });
                });
                $scope = obj.$scope;
                $element = obj.$element;

                $httpBackend.flush();
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('fetches list from server', function() {

                // GIVEN URL in selector input definition

                // WHEN opening selection list
                var el = $($element.find('.ui-select-container')[0]);
                AppTestUtils.selector.openDropdown(el, $scope);

                // THEN URL items should be present
                var items = $(el).find('.ui-select-choices-row > div');
                expect(items.length).toEqual(2);
                expect($(items[0]).text().trim()).toEqual('MNC');
                expect($(items[1]).text().trim()).toEqual('MCC');
            });
        });

        describe('Selector item is image', function() {

            beforeEach(module(appName));

            var $scope, $element, timeout;

            beforeEach(inject(function($rootScope, $compile, $timeout, $httpBackend) {
                var element = '<app-form no-status no-label name="selectorForm" no-submit model="model">' +
                        '<app-input ref="data"></app-input></app-form>';

                timeout = $timeout;

                $httpBackend.whenGET('/api/selection-list?fields=id,img')
                    .respond(200, [
                        {
                            id: 1,
                            img: "/static/img/checked.png"
                        },
                        {
                            id: 2,
                            img: "/static/img/icons/photos.png"
                        }
                    ]);

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.model = new BaseModel({
                        data: {
                            data: adminModels[0]
                        },
                        inputDefs: [
                            {
                                name: 'data',
                                type: "selector",
                                label: "Selections",
                                placeholder: 'Select data...',
                                selector: {
                                    displayKey: 'img',
                                    url: '/api/selection-list',
                                    type: 'image'
                                }
                            }
                        ]
                    });
                });
                $scope = obj.$scope;
                $element = obj.$element;

                $httpBackend.flush();
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('fetches images from server', function() {

                // GIVEN URL in selector input definition

                // WHEN opening selection list
                var el = $($element.find('.ui-select-container')[0]);
                AppTestUtils.selector.openDropdown(el, $scope);

                // THEN image items should be present
                var items = $(el).find('.ui-select-choices-row > div');
                expect(items.length).toEqual(2);
                expect($($(items[0]).find('img')[0]).prop('src')).toContain("/static/img/checked.png");
                expect($($(items[1]).find('img')[0]).prop('src')).toContain("/static/img/icons/photos.png");
            });
        });

        describe('Multiselector URL', function() {

            beforeEach(module(appName));

            var $scope, $element, timeout;

            var selectorList = [
                {
                    id: 'mnc',
                    description: "MNC"
                },
                {
                    id: 'mcc',
                    description: "MCC"
                }
            ];

            beforeEach(inject(function($rootScope, $compile, $timeout, $httpBackend) {
                var element = '<app-form no-status no-label name="selectorForm" no-submit model="model">' +
                        '<app-input ref="multiData"></app-input></app-form>';

                timeout = $timeout;

                $httpBackend.whenGET('/api/selection-list?fields=id,description')
                    .respond(200, selectorList);

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.model = new BaseModel({
                        data: {
                            multiData: [selectorList[0]]
                        },
                        multiData3: [],
                        inputDefs: [
                            {
                                name: 'multiData',
                                type: "multiSelector",
                                label: "Selections",
                                placeholder: 'Select data...',
                                selector: {
                                    displayKey: 'description',
                                    url: '/api/selection-list'
                                }
                            }
                        ]
                    });
                });
                $scope = obj.$scope;
                $element = obj.$element;

                $httpBackend.flush();
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('displays model values correctly', function() {

                // GIVEN URL in multi selector input definition
                // WHEN selector input is initialized
                timeout.flush();

                // THEN model values should not be changed
                expect($scope.model.multiData.length).toEqual(1);

                // AND model values are visible in UI
                expect($($element.find('.ui-select-container span.ng-scope')[1]).text()).toEqual(selectorList[0].description);
            });

            it('fetches list from server', function() {

                // GIVEN URL in selector input definition

                // WHEN opening selection list
                var el = $($element.find('.ui-select-container')[0]);
                AppTestUtils.selector.openDropdown(el, $scope);

                // THEN only one URL item should be present (as the other one has been already selected)
                var items = $(el).find('.ui-select-choices-row-inner > div');
                expect(items.length).toEqual(1);
                expect($(items[0]).text().trim()).toEqual('MCC');
            });
        });



        /*
         * Model that has 2 inputs; text and object. Object type includes 2 properties and only one is
         * to be shown in the form.
         */
        var modelOptions = {
            data: {
                name: 'abcd',
                objectData: {
                    multiData: [adminModels[0]],
                    name: 'test'
                }
            },
            inputDefs: [
                {
                    name: 'name',
                    type: "text",
                    label: "Name",
                    directives: ['required'],
                    modelOptions: {
                        debounce: 100
                    }
                },
                {
                    name: 'objectData',
                    type: 'object',
                    $order: ['multiData'],
                    $types: {
                        multiData: {
                            type: "multiSelector",
                            label: "Selections",
                            placeholder: 'Select data...',
                            selector: {
                                displayKey: 'description',
                                url: '/api/selection-list'
                            }
                        },
                        name: {
                            type: "text",
                            label: "Name",
                            directives: ['required', {type: 'maxlength', length: 5}]
                        }
                    }
                }
            ]
        };

        function objectInputSetup(html, skip_http) {
            beforeEach(inject(function($rootScope, $compile, $timeout, $httpBackend) {
                var self = this;

                this.$timeout = $timeout;
                if (!skip_http) {
                    $httpBackend.whenGET('/api/selection-list?fields=id,description').respond(200, adminModels);
                }

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, html, function(scope) {
                    scope.model = new BaseModel($.extend(true, {}, modelOptions));
                    scope.submit = function(data) {
                        self.submitData = data;
                    };
                });
                this.$scope = obj.$scope;
                this.$element = obj.$element;
                this.$formScope = obj.$elementScope;

                if (!skip_http) {
                    $httpBackend.flush();
                }
            }));
        }

        function modelInitializedTestCase() {
            // GIVEN object input type in model definition

            // WHEN model data is shown in form
            this.$timeout.flush();

            // THEN data should remain unchanged
            expect(this.$scope.model.name).toEqual('abcd');
            expect(this.$scope.model.objectData.name).toEqual('test');
            expect(this.$scope.model.objectData.multiData.length).toEqual(1);
            expect(this.$scope.model.objectData.multiData[0].id).toEqual(adminModels[0].id);
        }

        function formSubmittedTestCase() {
            // GIVEN modifed values in form
            var value = 'tset';
            var input = $(this.$element.find('input')[0]);
            input.val(value);
            input.trigger('input');
            this.$timeout.flush();
            expect(this.$formScope.canSubmit()).toBeTruthy();

            // WHEN form is submitted
            var element = this.$element.find('button');
            AppTestUtils.ngClick(element[0]);
            this.$scope.$digest();

            // THEN submit data should be correct
            expect(this.submitData.name).toEqual(value);
            expect(this.submitData.objectData.name).toEqual('test');
            expect(this.submitData.objectData.multiData.length).toEqual(1);
            expect(this.submitData.objectData.multiData[0].id).toEqual(adminModels[0].id);

            // AND model data is also correct
            expect(this.$scope.model.name).toEqual(value);
            expect(this.$scope.model.objectData.name).toEqual('test');
            expect(this.$scope.model.objectData.multiData.length).toEqual(1);
            expect(this.$scope.model.objectData.multiData[0].id).toEqual(adminModels[0].id);

            // -----

            // WHEN resetting form values
            AppTestUtils.ngClick(this.$element.find('button')[1]);
            this.$scope.$digest();

            // THEN correct model values should be reset
            expect(this.$scope.model.name).toEqual(null);
            expect(this.$scope.model.objectData.multiData.length).toEqual(0);
            expect(this.$scope.model.objectData.name).toEqual('test');
        }

        describe('Object input type as transcluded input', function() {

            beforeEach(module(appName));

            // Show only object input element in the form
            var element = '<app-form no-status no-label name="objectForm" submit-fn="submit(data)" ' +
                    'clear-label="Reset" model="model"><app-input ref="name"></app-input>' +
                    '<app-input ref="objectData"></app-input></app-form>';

            objectInputSetup.call(this, element);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('displays model values correctly', function() {
                expect(this.$element.find('app-input').length).toEqual(3);
                modelInitializedTestCase.call(this);
            });

            it('form is submitted', function() {
                formSubmittedTestCase.call(this);
            });
        });

        describe('Object input type as auto input', function() {

            beforeEach(module(appName));

            // Show all available input elements in the form
            var element = '<app-form no-status no-label name="objectForm" submit-fn="submit(data)" ' +
                    'clear-label="Reset" model="model"></app-form>';

            objectInputSetup.call(this, element);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('displays model values correctly', function() {
                modelInitializedTestCase.call(this);
            });

            it('form is submitted', function() {
                formSubmittedTestCase.call(this);
            });
        });

        describe('Model has modelOptions defined', function() {

            beforeEach(module(appName));

            var element = '<app-form name="optionsForm" model="model"><app-input ref="name">' +
                    '</<app-input></app-form>';

            objectInputSetup.call(this, element, true);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('modelOptions are used for input', function() {
                expect($(this.$element.find('input')[0]).attr('ng-model-options')).toEqual('{"debounce":100}');
            });
        });

        describe('View only form', function() {

            beforeEach(module(appName));

            // Show all available input elements in the form as view only
            var element = '<app-form view-only="true" name="objectForm" model="model"></app-form>';

            objectInputSetup.call(this, element, true);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('renders model data correctly', function() {
                var inputs = this.$element.find('.view-only-control');

                expect(inputs.length).toEqual(2);
                expect($(inputs[0]).text()).toEqual(modelOptions.data.name);
                expect($(inputs[1]).text()).toEqual(adminModels[0].description);
            });
        });
    });

})(define, describe);
