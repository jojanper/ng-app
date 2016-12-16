/**
 * Generate HTML for last modified data.
 */
define([
    'common/toolbox',
    'common/html'
], function(Toolbox, htmlLib) {

    var LastModified = Toolbox.BaseClass.extend({

        constructor: function(timestamp) {
            this.timestamp = timestamp;
            this.prettyTs = new Date(this.timestamp);
        },

        timeAgoHTML: function() {
            // Use custom directive to handle the timestamp conversion in UI.
            /*jshint camelcase: false */
            return htmlLib.time_ago(this.prettyTs, {
                'class': 'timeago',
                'title': this.timestamp
            });
            /*jshint camelcase: true */
        }
    });

    return LastModified;
});
