define([
    'utils/controllers/basecontroller',
    'utils/models/user',
    'text!./templates/login.html',
    'text!./templates/logout.html'
], function (BaseCtrl, UserModel, LoginTemplate, LogoutTemplate) {
    'use strict';

    var LoginController = BaseCtrl.extend({
        initialize: function($scope) {
            $scope.user = new UserModel();

            $scope.login = function(data) {
                $scope.$root.user.setLoginData(data);
            };
        }
    });

    function LoginRun($rootScope, $cookies) {
        var userData = $cookies.getObject('user') || {};
        $rootScope.user = new UserModel(userData);
    }

    var LogoutController = BaseCtrl.extend({
        initialize: function($scope) {
            var $cookies = this.arguments[0]
            var $location = this.arguments[1];

            $scope.setToLoadingState();
            $cookies.remove('user');
            $scope.$root.user = null;
            $location.path('/login');
        }
    });

    var Login = function () {
        return {
            scope: {},
            restrict: 'E',
            template: LoginTemplate,
            controller: ['$scope', '$element', '$attrs', LoginController]
        };
    };

    var Logout = function () {
        return {
            scope: {},
            restrict: 'E',
            template: LogoutTemplate,
            controller: ['$scope', '$element', '$attrs', '$cookies', '$location', LogoutController]
        };
    };

    return [
        {
            componentName: 'auth',

            feature: 'directive',
            name: 'dngLogin',
            cls: Login,
            run: ['$rootScope', '$cookies', LoginRun]
        },
        {
            feature: 'directive',
            name: 'dngLogout',
            cls: Logout
        }
    ];
});
