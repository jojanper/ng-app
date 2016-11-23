(function(define, describe) {
    "use strict";

    var dependencies = [
        'utils/filters/disabled'
    ];

    define(dependencies, function(DisabledFilter) {

        describe('DisabledFilter', function() {

            it('filters correctly', function() {
                var input1 = 'test';
                expect(DisabledFilter.cls()(input1)).toEqual(input1);

                var input2 = ['test'];
                expect(DisabledFilter.cls()(input2)).toEqual(input2);

                var input3 = [{value: 'test', disabled: true}];
                expect(DisabledFilter.cls()(input3)).toEqual([]);
            });
        });
    });

})(define, describe);
