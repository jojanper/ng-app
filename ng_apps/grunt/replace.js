module.exports = function() {
    return {
        // Prepare app HTML for production
        dist_template: {
            src: ['ng-templates/ng-apps.html.template'],
            dest: 'ng-templates/ng-apps.html',
            replacements: [{
                from: '<!-- replace-tag -->',
                to: '<script src="{{ NG_APP_PREFIX }}dist/scripts/<%= distJsName %>"></script>'
            }]
        },

        // Prepare app HTML for development
        dev_template: {
            src: ['ng-templates/ng-apps.html.template'],
            dest: 'ng-templates/ng-apps.html',
            replacements: [{
                from: '<!-- replace-tag -->',
                to: '<script src="{{ NG_APP_PREFIX }}components/jquery/dist/jquery.min.js"></script>' +
                    '<script src="{{ NG_APP_PREFIX }}components/requirejs/require.js" ' +
                    'data-main="{{ NG_APP_PREFIX }}scripts/main"></script>'
            }]
        }
    };
};
