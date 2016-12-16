define([
    'angular',
    './base',
    './input_vds'
], function (ng, BaseInput, InputDirectiveMap) {
    "use strict";

    var InputDirectives = BaseInput.extend({
        directives: InputDirectiveMap,

        toHTML: function($scope) {
            var self = this;
            var directives = [];

            if (this.options.directives) {
                ng.forEach(this.options.directives, function(value) {
                    var directive;

                    if (ng.isObject(value)) {
                        directive = self.directives[value.type];
                    }
                    else {
                        directive = self.directives[value];
                    }

                    if (directive && directive.inputTemplate) {
                        this.push(directive.inputTemplate.call(self, $scope, value));
                    }

                }, directives);
            }

            return directives.join(' ');
        }
    });

    return InputDirectives;
});
