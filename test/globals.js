backendConfig = {
    templatePrefix: null,
    urls: {
        playlists: '/api/playlist',
        upload: '/api/file-upload'
    },

    isTestRunner: true,

    baseUrl: '/api/generic',
    authUrls: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        register: '/api/auth/register',
        activate: '/api/auth/activate',
        'password-reset': '/api/auth/password-reset',
        'password-reset-confirm': '/api/auth/password-reset-confirm',
        'password-change': '/api/auth/password-change',
        extlogin: '/api/auth/ext-auth',
        'user-details': '/api/auth/user-details'
    }
};
