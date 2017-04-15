backendConfig = {
    templatePrefix: null,
    urls: {
        playlists: '/api/playlist',
        upload: '/api/file-upload'
    },

    isTestRunner: true,

    executeUrlResolverRunMethod: false,

    baseUrl: '/api/generic',
    authUrls: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        register: '/api/auth/register',
        activate: '/api/auth/activate',
        extlogin: '/api/auth/ext-auth'
    }
};
