var utils = require('../nodejs/utils');

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
