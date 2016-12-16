(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('MenuDropdown directive', function() {
            var item1Called, title = 'Dropdown menu';

            // Instantiate directive.
            var element = '<menu-dropdown menu-open="right" title="' + title + '" menu-items="menuItems"></menu-dropdown>';
            AppTestUtils.appTestSetup.call(this, element, function(scope) {
                scope.menuItems = [
                    {
                        callback: function() {
                            item1Called = true;
                        },
                        text: 'The first choice!'
                    },
                    {
                        divider: true
                    },
                    {
                        link: '#/home',
                        text: 'This is a link'
                        }
                ];
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                var element = this.$element.find('ul > li');
                expect(element.length).toEqual(this.$scope.menuItems.length);
                expect($(element[2]).find('a').prop('href')).toContain(this.$scope.menuItems[2].link);
                expect($(element[2]).find('a').html()).toEqual(this.$scope.menuItems[2].text);
                expect(this.$element.find('button').text()).toContain(title);
            });

            it('opens menu selection', function() {

                var element = this.$element.find('button');
                var actionElement = this.$element.find('ul > li > a');
                var scope = $(actionElement[0]).scope();

                // Menu is not open after element has been creation
                expect(element[0].outerHTML).toContain('aria-expanded="false"');

                // Menu is open when clicked
                element.click();
                this.$scope.$digest();
                expect(element[0].outerHTML).toContain('aria-expanded="true"');
                expect(scope.status.isopen).toBeTruthy();

                // Menu is aligned on the right side
                expect(this.$element.find('.dropdown-menu').attr('class')).toContain('dropdown-menu-right');

                // Action is called when clicked
                $(actionElement[0]).click();
                this.$scope.$digest();
                expect(item1Called).toBeTruthy();

                // Programmatically closing menu
                scope.toggleDropdown({
                    preventDefault: function() {},
                    stopPropagation: function() {}
                });
                this.$scope.$digest();
                expect(scope.status.isopen).toBeFalsy();
                expect(element[0].outerHTML).toContain('aria-expanded="false"');
            });
        });
    });

})(define, describe);
