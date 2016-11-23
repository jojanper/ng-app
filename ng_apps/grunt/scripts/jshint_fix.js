require('shelljs/global');
var fs = require('fs');
var options = require('minimist')(process.argv.slice(2));
var utils = require('./utils.js');

if (!utils.isJenkins()) {
    exit(0);
}

var path = options.path;
var xmlFile = options.xmlfile;

var cmd = "sed -E 's,name=\"..,name=\"" + path + ",g' " + xmlFile;

var obj = exec(cmd);

if (obj.code === 0) {
    fs.writeFileSync(xmlFile, obj.output);
    utils.logSuccess();
}
else {
    utils.logError('Unable to fix the paths for ' + xmlFile);
}

exit(0);
