[![Build Status](https://travis-ci.org/jojanper/ng-app.svg?branch=master)](https://travis-ci.org/jojanper/ng-app)

# ng-app
> AngularJS 1.x application prototyping.

## Usage

### Install dependencies
```
npm run prepare
```

This installs both Bower and NPM dependencies.

### Run JavaScript code styling (jshint + jscs)
```
npm run codestyle
```

### Run unit tests
```
npm test
```

Test (and code coverage) reports are located in `build/test_reports`.

### Run code styling + unit tests
```
npm run dev-test
```

### Build project
Build into `dist` directory.
```
npm run build
```

### Create documentation
```
npm run docs
```

Documentation is located in `build/docs`.

## Project structure
This distribution contains the following project structure :

* grunt
    * Grunt tasks and associated scripting code.
* ng-templates
    * Some Angular HTML templates used by the application.
* scripts
    * Angular code (app views, directives, etc).
* test
    * Unit test specs.
* vendor
    * Some vendor scripts used by application code (via RequireJS).

## What's Inside?

Application code uses Bower + RequireJS + AngularJS.

Unit testing is based on Karma + Jasmine + Istanbul configuration.

Build code uses Grunt.

### Continuous Integration (CI)

#### Travis CI
https://travis-ci.org/jojanper/ng-app
