/**
 * Directive for handling ESC key press events.
 *
 * Usages:
 *
 * <input key-esc="function()"></input>
 *
 * Supported attributes:
 *
 * Configuration:
 *
 * angular.module('myApp').dialog('keyEsc', KeyEsc);
 */
define([
    'common/keypress'
], function (KeyPress) {
    "use strict";

    var KeyEsc = function() {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, $element, $attrs) {
                var keyObj = new KeyPress($scope, $element, {
                    'appKey': 'focus',
                    'keyPress': 'esc',
                    'keyPressAction': $attrs.keyEsc
                });

                keyObj.execute();
            }
        };
    };

    return {
        feature: 'directive',
        name: 'keyEsc',
        cls: KeyEsc
    };
});
