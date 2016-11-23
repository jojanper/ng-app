define(['jquery', 'underscore'], function($, _) {

    /**
     * Manage HTML templates.
     */
    TemplateManager = {

        // Template set (cache)
        templates: {},

        /**
         * Get the specified HTML template. If the template is not locally
         * available (cached), fetch it from server.
         */
        get: function(id, callback){
            var template = this.templates[id];

            if (template) {
                callback(template);

            } else {
                var self = this;

                $.ajax({
                    type: 'get',
                    url: "/templates/" + id + ".html",
                    success: function(template) {
                        var $tmpl = $(template);
                        self.templates[id] = template;
                        callback(template);
                    }
                });
            }
        }
    };

    return $.extend(TemplateManager, {_id: 'TemplateManager'});
});
