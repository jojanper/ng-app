/**
 * Angular documentation generator.
 */
module.exports = function() {
    return {
        options: {
            dest: '<%= docsPath %>/ng-docs',
            deferLoad: false,
            html5Mode: false,
            scripts: [
                'vendor/angular-1.3.1.js',
                'vendor/angular-animate-1.3.1.js'
            ]
        },
        dist: {
            src: ['scripts/utils/**/*.js'],
            title: 'Draal Angular components documentation'
        }
    };
};
