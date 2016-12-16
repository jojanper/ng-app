define([
    'text!./templates/edit.html',
    'common/utils'
], function (BaseTemplate, UtilsLib) {
    'use strict';

    function ModelEditTemplate(model) {
        return UtilsLib.Strings.replaceAll(BaseTemplate, '[[MODEL]]', model);
    }

    return ModelEditTemplate;
});
