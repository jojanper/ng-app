require('shelljs/global');

echo('DONE');

echo(process.argv);

var files = find('scripts').filter(function(file) { return file.match(/n\.js$/); });

echo(files);

process.exit(1);

exit(0);
