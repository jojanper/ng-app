var utils = require('../nodejs/utils');

var jshint = {
    src: ['<%= appScriptsPath %>/**/*.js'],
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    }
};

if (utils.isJenkins()) {
    jshint.options.force = true;
    jshint.options.reporter = 'checkstyle';
    jshint.options.reporterOutput = "<%= jsHintXml %>";
}

module.exports = function() {
    return {
        jshint: jshint
    };
};
