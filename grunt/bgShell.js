module.exports = function() {
    return {
        _defaults: {
            bg: false
        },

        /**
         * Clean the app distribution folder.
         */
        app_clean: {
            execOpts: {
                cwd: '.'
            },
            cmd: 'rm -Rf <%= distScriptsPath %>/*'
        },

        /**
         * Copy app HTML template to distribution folder.
         */
        copy_app_template: {
            execOpts: {
                cwd: '.'
            },
            cmd: 'cp <%= appMainTemplate %> <%= distPath %>'
        }
    };
};
