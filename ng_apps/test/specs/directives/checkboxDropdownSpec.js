(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        var appName = 'app';

        describe('CheckboxMenuDropdown directive', function() {

            beforeEach(module(appName));

            var $scope, $element, itemIndex, itemStatus, title = 'Checkbox menu';

            beforeEach(inject(function($rootScope, $compile) {
                // Instantiate directive.
                var element = '<checkbox-menu-dropdown title="' + title + '" on-change="checkboxOnChange" ' +
                    'checkbox-items="checkboxMenuItems"></checkbox-menu-dropdown>';

                var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element, function(scope) {
                    scope.checkboxMenuItems = ['One', 'Two', 'Three'];
                    scope.checkboxOnChange = function(index, status) {
                        itemIndex = index;
                        itemStatus = status;
                    };
                });
                $scope = obj.$scope;
                $element = obj.$element;
            }));

            afterEach(function() {
                $scope.$destroy();
            });

            it('initializes correctly', function() {
                var element = $element.find('ul > li');
                expect(element.length).toEqual($scope.checkboxMenuItems.length + 1);
                expect($element.find('input[type=checkbox]').length).toEqual($scope.checkboxMenuItems.length);
                expect($element.find('button').text()).toContain(title);
            });

            it('checkbox is clicked', function() {
                // GIVEN checkbox items in dropdown menu
                var element = $element.find('input[type=checkbox]');

                // WHEN selecting first item
                element[0].click();
                $scope.$digest();

                // THEN it should be set to checked status
                expect(itemIndex.index).toEqual(0);
                expect(itemStatus).toBeTruthy();
                expect($(element[0]).prop('checked')).toBeTruthy();


                // WHEN selecting the first item again
                element[0].click();
                $scope.$digest();

                // THEN it should be set to unchecked status
                expect(itemIndex.index).toEqual(0);
                expect(itemStatus).toBeFalsy();
                expect($(element[0]).prop('checked')).toBeFalsy();
            });

            it('menu is closed', function() {
                // GIVEN close button in checkbox dropdown menu
                var element = $element.find('button[type=button]');

                // WHEN clicking the item
                element[1].click();
                $scope.$digest();

                // THEN menu should be in closed state
                expect($(element[1]).scope().status.isopen).toBeFalsy();
            });
        });
    });

})(define, describe);
