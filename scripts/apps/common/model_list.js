define([
    'text!./templates/list.html'
], function (BaseTemplate) {
    'use strict';

    function ModelListTemplate(template) {
        return BaseTemplate.replace('[[TEMPLATE]]', template);
    }

    return ModelListTemplate;
});
