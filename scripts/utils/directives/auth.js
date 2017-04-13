define([
    'utils/controllers/basecontroller',
    'utils/models/user',
    'text!./templates/login.html',
    'text!./templates/logout.html',
    'text!./templates/register.html',
    'text!./templates/passwordreset.html',
    'text!./templates/passwordchange.html',
    'text!./templates/passwordresetchange.html',
    'text!./templates/userprofile.html'
], function (BaseCtrl, UserModel, LoginTemplate, LogoutTemplate, RegisterTemplate,
    PasswordResetTemplate, PasswordChangeTemplate, PasswordResetChangeTemplate,
    UserProfileTemplate) {
    'use strict';

    var extUrl = backendConfig.authUrls.extlogin;
    var extSites = {
        google: extUrl + 'google?next=/',
        twitter: extUrl + 'twitter?next=/',
        facebook: extUrl + 'facebook?next=/',
        onedrive: extUrl + 'onedrive?next=/'
    };

    var LoginController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];

            $scope.user = new UserModel();

            $scope.login = function(data) {
                dngUserManagement.login(data);
            };

            $scope.extSites = extSites;
        }
    });

    function LoginRun($rootScope, $state, dngUserManagement) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            // Authentication and route access control
            dngUserManagement.canAccess($state, event, toState, toParams);
        });
    }

    var LogoutController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];
            $scope.setToLoadingState();
            dngUserManagement.logout(this.arguments[1]);
        }
    });

    var RegisterController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];
            var state = this.arguments[1];

            $scope.user = new UserModel();

            $scope.register = function(data) {
                dngUserManagement.register(data, state);
            };
        }
    });

    var ResetController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];

            $scope.user = new UserModel();

            $scope.reset = function(data) {
            };
        }
    });

    var ChangeController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];

            $scope.user = new UserModel();

            $scope.change = function(data) {
            };
        }
    });

    var ResetChangeController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];

            $scope.user = new UserModel();

            $scope.change = function(data) {
            };
        }
    });

    var UserProfileController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];

            $scope.user = dngUserManagement.user; //new UserModel();

            console.log($scope.user);

            $scope.userInfoChanges = function(data) {
                console.log(data);
            };
        }
    });

    var Login = function () {
        return {
            scope: {},
            restrict: 'E',
            template: LoginTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', LoginController]
        };
    };

    var Logout = function () {
        return {
            scope: {},
            restrict: 'E',
            template: LogoutTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', '$state', LogoutController]
        };
    };

    var Register = function () {
        return {
            scope: {},
            restrict: 'E',
            template: RegisterTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', '$state', RegisterController]
        };
    };

    var PasswordReset = function () {
        return {
            scope: {},
            restrict: 'E',
            template: PasswordResetTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', ResetController]
        };
    };

    var PasswordChange = function () {
        return {
            scope: {},
            restrict: 'E',
            template: PasswordChangeTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', ChangeController]
        };
    };

    var PasswordResetChange = function () {
        return {
            scope: {},
            restrict: 'E',
            template: PasswordResetChangeTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', ResetChangeController]
        };
    };

    var UserProfile = function () {
        return {
            scope: {},
            restrict: 'E',
            template: UserProfileTemplate,
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', UserProfileController]
        };
    };

    return [
        {
            componentName: 'auth',

            feature: 'directive',
            name: 'dngLogin',
            cls: Login,
            run: ['$rootScope', '$state', 'dngUserManagement', LoginRun]
        },
        {
            feature: 'directive',
            name: 'dngLogout',
            cls: Logout
        },
        {
            feature: 'directive',
            name: 'dngRegister',
            cls: Register
        },
        {
            feature: 'directive',
            name: 'dngPasswordReset',
            cls: PasswordReset
        },
        {
            feature: 'directive',
            name: 'dngPasswordChange',
            cls: PasswordChange
        },
        {
            feature: 'directive',
            name: 'dngPasswordResetChange',
            cls: PasswordResetChange
        },
        {
            feature: 'directive',
            name: 'dngUserProfile',
            cls: UserProfile
        }
    ];
});
