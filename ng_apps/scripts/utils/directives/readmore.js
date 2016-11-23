/**
 * @description
 * ReadMore directive for for collapsing and expanding long blocks
 * of text with “Show more” and “Show less” links.
 *
 * @example
   <read-more></read-more>
 *
 * # Scope:
 *
 *   * `'maxHeight'`: Maximum height before collapsing block is taken into use
 *   * `'moreLink'`: HTML for the "Show more" link
 *   * `'lessLink'`: HTML for the "Show less" link
 */
define([
    'jquery'
], function ($) {
    "use strict";

    var ReadMore = function ($timeout) {

        var options = {
            maxHeight: 20,
            moreLink: '<a class="expander" title="Expand">&#x25BC; Show more</a>',
            lessLink: '<a class="expander" title="Close">&#x25B2; Show less</a>'
        };

        return {
            restrict: 'E',
            scope: {
                maxHeight: "@",
                moreLink: "@",
                lessLink: "@"
            },
            link: function($scope, $element, attrs) {
                $scope.$evalAsync(function() {
                    var element = $element.find('div:first');
                    if (element.length < 1) {
                        element = $element;
                    }

                    element.readmore({
                        maxHeight: $scope.maxHeight || options.maxHeight,
                        moreLink: $scope.moreLink || options.moreLink,
                        lessLink: $scope.lessLink || options.lessLink,
                        afterToggle: function(trigger, element, more) {
                          if (!more) {
                              if($element.length > 0) {
                                  $('html, body').animate({
                                      scrollTop: $element.offset().top - 20
                                  }, 200);
                              }
                          }
                        }
                    });
                });
            }
        };
    };

    return {
        feature: 'directive',
        name: 'readMore',
        cls: ['$timeout', ReadMore]
    };
});
