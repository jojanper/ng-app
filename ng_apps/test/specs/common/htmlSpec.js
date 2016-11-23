define([
    'common/html'
], function(HtmlLib) {

    describe('html utility library', function() {

        it('supports checkbox (with label)', function() {
            var refHtml = '<input id="#id" type="checkbox" class="checkbox-test" value="yes" ' +
                    'checked="checked"/><label for="#id">Test</label>';
            var html = HtmlLib.checkbox('Test', '#id', 'yes', true, {class: 'checkbox-test'});
            expect(html).toEqual(refHtml);
        });

        it('supports checkbox (without label)', function() {
            var refHtml = '<input id="#id" type="checkbox" class="checkbox-test" value="yes" checked="checked"/>';
            var html = HtmlLib.checkbox(null, '#id', 'yes', true, {class: 'checkbox-test'});
            expect(html).toEqual(refHtml);
        });

        it('supports checkbox (with label=true)', function() {
            var refHtml = '<input id="#id" type="checkbox" class="checkbox-test" value="yes" ' +
                    'checked="checked"/><label for="#id"/>';
            var html = HtmlLib.checkbox(true, '#id', 'yes', true, {class: 'checkbox-test'});
            expect(html).toEqual(refHtml);
        });

        it('supports checkbox (with complex label)', function() {
            var refHtml = '<input id="#id" type="checkbox" class="checkbox-test" value="yes" ' +
                    'checked="checked"/><label for="#id">ab</label>';
            var html = HtmlLib.checkbox(['a', 'b'], '#id', 'yes', true, {class: 'checkbox-test'});
            expect(html).toEqual(refHtml);
        });
    });
});
