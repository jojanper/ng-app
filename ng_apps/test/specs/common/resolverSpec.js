define([
    'utils/common/resolver'
], function(Resolver) {

    describe('URL path resolver', function() {

        it('supports rest-api-models', function() {

            // GIVEN URL path
            var name = 'rest-api-models';

            // WHEN resolving path
            var url = Resolver(name);

            // THEN it should succeed
            expect(url).toEqual('/api/generic');
        });

        it('supports rest-api', function() {

            // GIVEN URL path
            var name = 'rest-api';
            var data = {appLabel: 'test', model: 'test2'};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2');
        });

        it('supports rest-api-model-meta', function() {

            // GIVEN URL path
            var name = 'rest-api-model-meta';
            var data = {appLabel: 'test', model: 'test2'};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2/meta');
        });

        it('supports rest-api-actions', function() {

            // GIVEN URL path
            var name = 'rest-api-actions';
            var data = {appLabel: 'test', model: 'test2', action: 'create'};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2/actions/create');
        });

        it('supports rest-api-models-actions', function() {

            // GIVEN URL path
            var name = 'rest-api-model-actions';
            var data = {appLabel: 'test', model: 'test2', modelId: 1, action: 'edit'};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2/1/actions/edit');
        });

        it('supports rest-api-models-id', function() {

            // GIVEN URL path
            var name = 'rest-api-model-id';
            var data = {appLabel: 'test', model: 'test2', modelId: 1};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2/1');
        });

        it('supports rest-api-models-id-history', function() {

            // GIVEN URL path
            var name = 'rest-api-model-id-history';
            var data = {appLabel: 'test', model: 'test2', modelId: 1};

            // WHEN resolving path
            var url = Resolver(name, data);

            // THEN it should succeed
            expect(url).toEqual('/api/generic/test/test2/1/history');
        });
    });
});
