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

            $scope.extSites = extSites;
            $scope.user = new UserModel();

            $scope.login = function(data) {
                dngUserManagement.login(data);
            };
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
            $scope.setToLoadingState();
            this.arguments[0].logout(this.arguments[1]);
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

    var AccountActivateController = BaseCtrl.extend({
        initialize: function($scope) {
            var state = this.arguments[1];
            this.arguments[0].activate(state.params.activationkey, state);
        }
    });

    var ChangeController = BaseCtrl.extend({
        initialize: function($scope) {
            var dngUserManagement = this.arguments[0];
            var state = this.arguments[1];

            $scope.user = new UserModel();

            $scope.changePw = function(data) {
                var pwData = {
                    'old_password': data.password3,
                    'new_password1': data.password,
                    'new_password2': data.password2
                };
                dngUserManagement.passwordChange(pwData, state);
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

            $scope.user = dngUserManagement.user;

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

    var AccountActivate = function () {
        return {
            scope: {},
            restrict: 'E',
            template: '',
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', '$state', AccountActivateController]
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
            controller: ['$scope', '$element', '$attrs', 'dngUserManagement', '$state', ChangeController]
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
            name: 'dngAccountActivate',
            cls: AccountActivate
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
