/**
 * Bootstraps angular onto the window.document node.
 * NOTE: the ng-app attribute should not be on the HTML file when using ng.bootstrap
 */
define([
    'jquery',
    'jquery.ui',
    'datatables',
    'require',
    'angular',
    'app',
    'timeago',
    'readmore',
    'domReady!',
    'ng-file-upload'
], function (jquery, jqueryui, datatables, require, ng) {
    'use strict';

    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['app']);
    });
});
