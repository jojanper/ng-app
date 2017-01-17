define([
    'utils/controllers/basecontroller',
    'utils/models/user'
], function (BaseCtrl, UserModel) {
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

    return [
        {
            feature: 'controller',
            name: 'LoginController',
            cls: ['$scope', '$element', '$attrs', LoginController],
            run: ['$rootScope', '$cookies', LoginRun]
        },
        {
            feature: 'controller',
            name: 'LogoutController',
            cls: ['$scope', '$element', '$attrs', LogoutController]
        }
    ];
});
