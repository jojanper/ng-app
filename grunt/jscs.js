var utils = require('./scripts/utils.js');

var jscs = {
    src: ['<%= appScriptsPath %>/**/*.js'],
    options: {
        config: ".jscsrc"
    }
};

if (utils.isJenkins()) {
    jscs.options.reporter = 'checkstyle';
    jscs.options.reporterOutput = "<%= jsCSXml %>";
}

module.exports = function() {
    return {
        jscs: jscs
    };
};
