(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap',
        'apps/menuConfig'
    ];

    define(dependencies, function(AppBootstrap, menuConfig) {

        describe('AppMainMenu directive with default menu', function() {

            // Instantiate tab element
            var element = '<app-main-menu></app-main-menu>';

            AppTestUtils.appTestSetup.call(this, element);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('default menu initializes correctly', function() {
                // GIVEN main menu items

                // WHEN menu is rendered

                // THEN menu items should match the default items
                var menuItems = this.$element.find('li');
                var appMenus = 0;
                for (var i = 0; i < menuConfig.length; i++) {
                    if (menuConfig[i].display) {
                        expect($(menuItems[appMenus]).find('a').html()).toEqual(menuConfig[i].display);
                        appMenus += 1;
                    }
                }

                expect(menuItems.length).toEqual(appMenus);
            });
        });

        describe('AppMainMenu directive with custom menu', function() {

            var menuItems = "[{link: 'test', display: 'display'}]";

            // Instantiate tab element
            var element = '<app-main-menu menu-items="' + menuItems + '"></app-main-menu>';

            AppTestUtils.appTestSetup.call(this, element);

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('initializes correctly', function() {
                // GIVEN main menu items

                // WHEN menu is rendered

                // THEN manu items should match the default items
                var menuItems = this.$element.find('li');
                expect(menuItems.length).toEqual(1);
                for (var i = 0; i < menuItems.length; i++) {
                    expect($(menuItems[i]).find('a').html()).toEqual('display');
                }
            });
        });
    });

})(define, describe);
