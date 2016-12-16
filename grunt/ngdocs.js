/**
 * Angular documentation generator.
 */
module.exports = function() {
    return {
        options: {
            dest: 'docs/ng-docs',
            deferLoad: false,
            html5Mode: false,
            scripts: [
                'components/angular/angular.js',
                'vendor/angular-animate.min.js'
            ]
        },
        dist: {
            src: ['scripts/utils/**/*.js'],
            title: 'Draal UI components documentation'
        }
    };
};
