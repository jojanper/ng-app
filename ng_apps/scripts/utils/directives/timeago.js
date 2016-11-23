/**
 * @description
 * TimeAgo directive for showing timestamps in more human readable format. HTML for the directive
 * can be created using LastModified object as new LastModified(<timestamp>).timeAgoHTML().
 *
 * @example
   <time_ago class="timeago" title="2015-05-11T18:13:43.929Z"/>
 */
define([], function () {
    "use strict";

    var TimeAgo = function () {

        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            link: function($scope, $element, attrs) {
                $scope.$evalAsync(function() {
                    $element.timeago();
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'timeAgo',
        cls: TimeAgo
    };
});
