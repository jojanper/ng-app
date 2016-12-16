define([
    'text!utils/directives/templates/visibility.html'
], function (VisibilityTemplate) {
    "use strict";

    /**
     * @ngdoc directive
     * @name visibilityViewer
     * @restrict E
     *
     * @description
     * Component for handling UI elements visibility. Elements visibility control can be transfered to
     * the component and vice versa. The control is transfered by sending visibility event with necessary
     * details about the element. The details include currently $attrs and $element attributes. The former
     * includes title or hideTitle property that describes title for the element under visibility UI. The
     * latter is the element that is to be transfered to the ownership of the visibility component.
     *
     * @example
       <example>
         <file name="index.html">
           <visibility-viewer></visibility-viewer>
         </file>
       </example>
     */
    var VisibilityViewer = function() {
        return {
            restrict: 'E',
            controller: 'VisibilityCtrl',
            template: VisibilityTemplate
        };
    };

    return {
        feature: 'directive',
        name: 'visibilityViewer',
        cls: VisibilityViewer
    };
});
