/**
 * Library release script.
 *
 * @module scripts/release.
 */

const shelljs = require('shelljs');
const options = require('minimist')(process.argv.slice(1));
const logger = require('log-symbols');
const format = require('util').format;


if (!options.version) {
    console.log(logger.error, 'No --version=<major.minor.patch> option defined!');
    process.exit(1);
}

// Available remotes
const remotes = (options.remotes) ? options.remotes.split(',') : ['origin'];

var cmds = [
    // Update package.json version
    format('npm --no-git-tag-version version %s', options.version),

    // Commit the new release
    'git add package.json',
    format('git commit -m "Release %s"', options.version),
    format('git tag -a v%s -m "Release %s"', options.version, options.version)
];

for (let remote of remotes) {
    cmds.push(format('git push %s v%s', remote, options.version));
    cmds.push(format('git push %s master', remote));
}

shelljs.exec(cmds.join(' && '), function(code) {
    process.exit(code);
});
