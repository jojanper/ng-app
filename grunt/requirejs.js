/**
 * Require.js (r.js) optimizer for JavaScript files.
 */
module.exports = function() {
    return {
        js_dist: {
            options: {
                baseUrl: '<%= appScriptsPath %>',
                out: '<%= distJsFile %>',
                name: 'main',
                mainConfigFile: '<%= appScriptsMainFile %>',
                exclude: [],
                uglify2: {
                    mangle: false
                }
            }
        },
        js_dev: {
            options: {
                baseUrl: '<%= appScriptsPath %>',
                out: '<%= distJsFile %>',
                name: 'main',
                mainConfigFile: '<%= appScriptsMainFile %>',
                exclude: [],
                optimize: 'none'
            }
        }
    };
};
