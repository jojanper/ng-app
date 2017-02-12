define([
    'common/utils',
    'jquery'
], function(UtilsLib, $) {

    describe('String.prototype', function() {

        it('supports capitalize1stLetter', function() {
            var str = 'test';
            expect(str.capitalize1stLetter()).toEqual('Test');
        });

        it('supports isObjectInput', function() {
            expect('test'.isObjectInput()).toBeFalsy();
            expect('test.test'.isObjectInput()).toBeTruthy();
            expect('test.test.test'.isObjectInput()).toBeTruthy();
        });

        it('supports inputFieldName', function() {
            expect('test'.inputFieldName()).toEqual('test');
            expect('object.test'.inputFieldName()).toEqual('object');
        });

        it('supports lowerCaseFirstLetter', function() {
            expect('Test'.lowerCaseFirstLetter()).toEqual('test');
        });
    });

    describe('ngDraal.Common', function() {

        it('supports isObject', function() {
            var obj = {a: 'b'};
            expect(UtilsLib.Common.isObject(obj)).toBeTruthy();
            expect(UtilsLib.Common.isObject('')).toBeFalsy();
        });

        it('supports getAttrValue', function() {
            var obj = {a: 'b'};
            expect(UtilsLib.Common.getAttrValue(obj, 'a')).toEqual('b');
            expect(UtilsLib.Common.getAttrValue(obj, 'b', 'c')).toEqual('c');
        });
    });

    describe('ngDraal.Strings', function() {

        it('supports isString', function() {
            expect(UtilsLib.Strings.isString({})).toBeFalsy();
            expect(UtilsLib.Strings.isString('test')).toBeTruthy();
        });
    });

    describe('ngDraal.File', function() {

        it('supports fileSize', function() {
            var obj = {size: 1024 * 1024 * 2};
            expect(UtilsLib.File.fileSize(obj)).toEqual('2MB');

            obj.size = 1024;
            expect(UtilsLib.File.fileSize(obj)).toEqual('1KB');
        });

        it('supports fileInfo', function() {
            var file = {
                name: 'test',
                size: 1024 * 1024 * 2,
                type: 'image/jpeg'
            };

            var info = UtilsLib.File.fileInfo(file);
            expect(info.name).toEqual(file.name);
            expect(info.size).toEqual('2MB');
            expect(info.type).toEqual(file.type);
            expect(info.isImage).toBeTruthy();

            file.type = 'audio/mp3';
            info = UtilsLib.File.fileInfo(file);
            expect(info.isImage).toBeFalsy();
        });
    });

    describe('Array.prototype', function() {

        it('supports reIndexOf', function() {
            var list = ['a', 'b'];
            var index = list.reIndexOf(/column-/);
            expect(index).toEqual(-1);
        });

        it('supports uniquePush', function() {
            var list = [];

            list.uniquePush(1);
            expect(list.length).toEqual(1);

            list.uniquePush(1);
            expect(list.length).toEqual(1);

            list.uniquePush(11);
            expect(list.length).toEqual(2);
        });
    });

    describe('Object', function() {

        it('resolveKey', function() {
            var obj = {b: 'test', c: {a: 'testa'}};
            expect(Object.resolveKey(obj, 'b')).toEqual(obj.b);
            expect(Object.resolveKey(obj, 'c.a')).toEqual(obj.c.a);
            expect(Object.resolveKey(obj, 'c.b')).toEqual(null);
        });

        it('setModelFieldValue', function() {
            var obj = {b: 'test', c: {a: 'testa'}, d: [], e: {a: []}};

            Object.setModelFieldValue(obj, 'b', 'abcd');
            expect(obj.b).toEqual('abcd');

            Object.setModelFieldValue(obj, 'c.a', 'abcd');
            expect(obj.c.a).toEqual('abcd');

            Object.setModelFieldValue(obj, 'd', 'abcd', true);
            expect(obj.d).toEqual(['abcd']);
            Object.setModelFieldValue(obj, 'd', 'abc', true);
            expect(obj.d).toEqual(['abcd', 'abc']);

            Object.setModelFieldValue(obj, 'e.a', 'abcd', true);
            expect(obj.e.a).toEqual(['abcd']);
            Object.setModelFieldValue(obj, 'e.a', 'abc', true);
            expect(obj.e.a).toEqual(['abcd', 'abc']);
        });
    });

    describe('jQuery', function() {
        it('sprintf', function() {
            expect($.sprintf('url("%s")', 'http://img.png')).toEqual('url("http://img.png")');
        });
    });
});
