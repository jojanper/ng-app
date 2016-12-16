(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('Rest factory', function() {

            var url = '/api/generic/media/mediafolder/1/actions/edit';

            AppTestUtils.appTestSetup.call(this);

            it('submitData succeeds', function() {

                // GIVEN success when posting data to server
                this.$httpBackend.whenPOST(url).respond(200, {data: {}});

                // WHEN posting data
                var called = false;
                this.rest.submitData({}, url, null, null, false, function() {
                    called = true;
                });
                this.$httpBackend.flush();

                // THEN success callback is called
                expect(called).toBeTruthy();
            });

            it('submitData fails', function() {

                // GIVEN failure when posting data to server
                this.$httpBackend.whenPOST(url).respond(400, {'errors': ['Error']});

                // WHEN posting data
                var called = false;
                this.rest.submitData({}, url, null, null, false, null, function() {
                    called = true;
                });
                this.$httpBackend.flush();

                // THEN failure callback should be called
                expect(called).toBeTruthy();
            });
        });
    });

})(define, describe);
