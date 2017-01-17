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
            $scope.setToLoadingState();
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
            controller: ['$scope', '$element', '$attrs', LogoutController]
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
