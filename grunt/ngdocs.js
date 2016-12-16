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
                'components/angular/angular.js',
                'vendor/angular-animate.min.js'
            ]
        },
        dist: {
            src: ['scripts/utils/**/*.js'],
            title: 'Draal Angular components documentation'
        }
    };
};
