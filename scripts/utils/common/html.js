/**
 * HTML utility library.
 */
define([
    'underscore',
    'jquery'
], function (_, $) {

    /**
     * Currying support to get a partial function
     */
    function curry(fn) {
        var slice = Array.prototype.slice;
        var storedArgs = slice.call(arguments, 1);
        return function () {
            var newArgs = slice.call(arguments);
            var args = storedArgs.concat(newArgs);
            return fn.apply(null, args);
        };
    }

    function encode(string) {
        return $("<div/>").text(string).html();
    }

    var HtmlUtilsImpl = {
        tag: function (tagName, innerValue, atrs) {
            var html = '';
            if (typeof(innerValue) === 'object') {
                _.each(innerValue, function (item) {
                    html += item;
                });
            } else {
                html += ('' + innerValue);
            }
            var atrsHtml = '';
            _.each(atrs, function (value, key) {
                if (value !== undefined && value !== false) {
                    value += '';
                    atrsHtml += ' ' + key + '="' + encode(value).replace(/"/g,'&quot;') + '"';
                }
            });
            var tag = '<' + tagName + atrsHtml;
            if (html) {
                return tag +'>' + html + '</' + tagName + '>';
            }
            return tag + '/>';
        },

        /**
         * Create a labeled input checkbox.
         * @param label The label name for this checkbox
         * @param id The id
         * @param value The value attribute (optional)
         * @param isChecked Should this be checked or not checked? (optional)
         * @param attrs Additional attributes
         * @return string of HTML code
         */
        checkbox: function (label, id, value, isChecked, attrs) {
            var ourAttrs = {id: id, type: "checkbox"};
            if (attrs) {
                $.extend(ourAttrs, attrs);
            }
            if (value !== null) {
                ourAttrs.value = value;
            }
            if (isChecked) {
                ourAttrs.checked = 'checked';
            }
            var inputTag = this.tag('input', '', ourAttrs);
            if (!label) {
                return inputTag;
            }
            if (label === true) {
                label = '';
            }
            return inputTag + this.tag('label', label, {'for': id});
        }
    };

    _.each([
        'a', 'abbr', 'div', 'fieldset', 'input', 'label', 'li', 'option',
        'p', 'table', 'tbody', 'thead', 'td', 'th', 'tr', 'ul', 'select',
        'span', 'media_type', 'time_ago', 'form', 'button', 'img'
    ], function (name) {
        this[name] = curry(this.tag, name);
    }, HtmlUtilsImpl);

    return HtmlUtilsImpl;
});
