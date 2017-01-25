var path = require('path');

var buildFolder = 'build';

module.exports = {
    buildFolder: buildFolder,
    testReportsFolder: path.join(buildFolder, 'test_reports'),
    docsFolder: path.join(buildFolder, 'docs')
};
