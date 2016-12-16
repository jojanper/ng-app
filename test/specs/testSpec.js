define(['test_app', 'jquery', 'underscore'], function(App, $, _) {

    var appName = 'test.draal-apps';

    beforeEach(function() {
        // Make sure test app is loaded...
        module(appName);
    });

    describe('Test framework with requirejs', function() {

        it('works for app', function() {
            var el = $('<div></div>');

            var app = new App(el);
            app.render();

            expect(el.text()).toEqual('require.js up and running');
        });

        it('works for underscore', function() {
            // just checking that _ works
            expect(_.size([1,2,3])).toEqual(3);
        });
    });
});
