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
        },

        /*
         * Push local (master) branch to remote master. Push to subtree remotes also.
         */
        push_2_master: {
            execOpts: {
                cwd: '../../../'
            },
            cmd: [
                'git push origin master',
                'git subtree push -P www/angular angular master',
                'git push bitbucket master',
                'git subtree push -P www/angular bitbucket_angular master;'
            ].join(';')
        }
    };
};
