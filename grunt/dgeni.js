/**
 * Javascript documentation generator using dgeni.
 */
module.exports = function() {
    return {
        options: {
            basePath: '<%= appPath %>'
        },
        dest: 'docs/dgeni-docs',
        src: ['scripts/utils/**/*.js']
    };
};
