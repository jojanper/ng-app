(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('appLogger service', function() {
            var appLogger, $log;

            AppTestUtils.appTestSetup.call(this);

            beforeEach(inject(function(_appLogger_, _$log_) {
                appLogger = _appLogger_;
                $log = _$log_;
            }));

            it('logs messages', function() {
                var loggers = ['info', 'warn', 'error', 'debug'];

                for (var i = 0; i < loggers.length; i++) {
                    // GIVEN logging message
                    var msg = 'Test message';

                    // WHEN message is logged
                    var logMethod = loggers[i];
                    spyOn($log, logMethod).and.callThrough();
                    appLogger[logMethod](msg);

                    // THEN logger is called
                    expect($log[logMethod]).toHaveBeenCalled();
                }
            });
        });
    });

})(define, describe);
