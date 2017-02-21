var AppTestUtils = {
    name: 'AppTestUtils',

    ngCreateElement: function ($rootScope, $compile, htmlElement) {
        var $scope, $element;

        // Instantiate element.
        $element = angular.element(htmlElement);
        $compile($element)($rootScope.$new());
        $rootScope.$digest();

        // Grab controller instance
        var controller = $element.controller();

        // Grab scope. Depends on type of scope.
        // See angular.element documentation.
        $scope = $element.isolateScope() || $element.scope();

        return {
            $scope: $scope,
            $element: $element
        };
    },

    /**
     * Compiles HTML element (that contains Angular markup) for testing purposes.
     *
     * @param {Object} element HTML element.
     * @param {Object} $scope Scope object.
     */
    ngCompileElement: function ($rootScope, $compile, htmlElement, callback) {
        var $scope, $element;

        // Create fresh scope
        $scope = $rootScope.$new();

        // Initialize scope, if needed
        if (callback) {
            callback($scope);
        }

        // Compile HTML
        var el = angular.element(htmlElement);
        $element = $compile(el)($scope);
        $scope.$digest();

        return {
            $scope: $scope,
            $element: $element,
            $elementScope: $element.isolateScope() || $element.scope()
        };
    },

    /**
     * Apply click to AngularJS element using plain JavaScript.
     *
     * @param {Object} element HTML element.
     * @param {Object} $scope Scope object.
     */
    ngClick: function ($element, $scope) {
        var event = document.createEvent("MouseEvent");
        event.initMouseEvent("click", true, true);
        $element.dispatchEvent(event);

        if ($scope) {
            $scope.$digest();
        }
    },

    /**
     * Apply click to AngularJS element using JQuery.
     *
     * @param {Object} element HTML element.
     * @param {Object} $scope Scope object.
     */
    click: function(element, $scope) {
        $(element).click();
        $scope.$digest();
    }
};


/**
 * Test setup utility for unit/module tests. Call with Jasmine context.
 *
 * @param {String} html HTML element to create.
 * @param {Function} scopeCallback Callback for initializing scope object.
 * @param {Function} httpBackendCallback Callback for HTTP calls.
 * @param {Function} prepareCallback Callback to finish the test setup.
 * @param {Function} preInjectCallback Callback to before inject call.
 */
AppTestUtils.appTestSetup = function(html, scopeCallback, httpBackendCallback, prepareCallback, preInjectCallback) {
    this.appName = 'app';

    this.$scope = null;
    this.$element = null;
    this.$location = null;

    beforeEach(module("app.templates"));

    beforeEach(module(this.appName));

    if (prepareCallback) {
        prepareCallback();
    }

    beforeEach(function() {

        if (preInjectCallback) {
            preInjectCallback.call(this);
        }

        inject(function($compile, $rootScope, $httpBackend, $location, $templateCache,
                        $controller, $stateParams, appMessagesService, network, appLogger,
                        rest, $timeout, $q, $cookies, $state) {
            var self = this;

            this.$location = $location;
            this.$httpBackend = $httpBackend;
            this.$templateCache = $templateCache;
            this.$rootScope = $rootScope;
            this.appMessagesService = appMessagesService;
            this.network = network;
            this.appLogger = appLogger;
            this.rest = rest;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$cookies = $cookies;
            this.$state = $state;

            if (httpBackendCallback) {
                httpBackendCallback($httpBackend, $templateCache);
            }

            if (html) {
                // Instantiate element
                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, html, function(scope) {
                    if (scopeCallback) {
                        scopeCallback.call(self, scope, $stateParams);
                    }
                });
                this.$scope = obj.$scope;
                this.$element = obj.$element;
                this.$elementScope = obj.$elementScope;
            }

            if (httpBackendCallback) {
                $httpBackend.flush();
            }
        });
    });

    afterEach(function() {
        if (this.$scope) {
            this.$scope.$destroy();
        }
    });

    return this;
};

/*
 * Utility functions for selector (ui-select) testing:
 *
 * https://github.com/angular-ui/ui-select/blob/master/test/select.spec.js
 */
function openDropdown(el, $scope) {
    var $select = el.scope().$select;
    $select.open = true;
    $scope.$digest();
};

function isDropdownOpened(el) {
    return el.scope().$select.open && el.hasClass('open');
}

function clickItem(el, text, $scope) {

    if (!isDropdownOpened(el)) {
        openDropdown(el, $scope);
    }

    $(el).find('.ui-select-choices-row div:contains("' + text + '")').click();
    $scope.$digest();
}

AppTestUtils.selector = {
    openDropdown: openDropdown,
    isDropdownOpened: isDropdownOpened,
    clickItem: clickItem,
    getMatchLabel: function(el) {
        return $(el).find('.ui-select-match > span:first > span[ng-transclude]:not(.ng-hide)').text();
    },
    getSelectionItems: function($element) {
        return $element.find('.ui-select-choices-row');
    },
    getSelector: function($element) {
        return $element.find('.ui-select-container');
    }
};

// Provide authenticated user
AppTestUtils.login = function(signoutCallback) {
    var userData = {
        id: 1,
        username: 'testuser',
        display: 'Test User'
    };

    var $cookies = {
        getObject: function() {
            return userData;
        },
        remove: function() {
            if (signoutCallback) {
                signoutCallback();
            }
        }
    };

    module(function($provide) {
        $provide.value('$cookies', $cookies);
    });
}
