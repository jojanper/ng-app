define([
    'jquery'
], function(jQuery) {

    /**
     * @fileOverview Custom namespace : ngDraal.
     * @author <a href="mailto:juha.ojanpera@gmail.com">Juha Ojanpera</a>
     * @version 0.1
     */

    /**
     * Custom namespace ngDraal
     * @namespace
     */
    var ngDraal = {
        name: 'ngDraal'
    };

    /**
     * General purpose utility functions.
     * @memberOf ngDraal
     * @namespace
     */
    ngDraal.Common = {
        isObject: function(obj) {
            return ((typeof obj === "object") && (obj !== null)) ? true : false;
        }
    };

    /**
     * General purpose file utility functions.
     * @memberOf ngDraal
     * @namespace
     */
    ngDraal.File = {
        name: 'ngDraal.File',

        /**
         * Return true if specified file is image, false otherwise.
         */
        isImage: function(file) {
            if(file.type.match(/^image\//)) {
                return true;
            }

            return false;
        },

        /**
         * Return info about the specified file.
         */
        fileInfo: function(file) {
            return {
                name: file.name,
                size: ngDraal.File.fileSize(file),
                type: file.type,
                isImage: ngDraal.File.isImage(file)
            };
        },

        /**
         * Determine size of specified file and return as string.
         *
         * @param {object} file File object.
         * @return {string} File size.
         */
        fileSize: function(file) {
            var fileSize;

            if (file.size > 1024 * 1024) {
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            }
            else {
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
            }

            return fileSize;
        }
    };


    /**
     * String related utility functions.
     * @memberOf ngDraal
     * @namespace
     */
    ngDraal.Strings = {
        name: 'ngDraal.Strings',

        /**
         * Regular expressions contain special (meta) characters, and as such it is dangerous
         * to blindly pass an argument in the find function above without pre-processing it to
         * escape those characters. This is covered in the Mozilla Developer Network's JavaScript
         * Guide on Regular Expressions, where they present the following utility function.
         */
        escapeRegExp: function (string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },

        replaceAll: function (string, find, replace) {
            return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
        }
    };

    /**
     * Regex IndexOf for arrays.
     *
     * This little addition to the Array prototype will iterate over array
     * and return the index of the first element which matches the provided
     * regular expresion.
     *
     * Note: This will not match on objects.
     *
     * @param {RegEx} rx The regular expression to test with.
     * @return {Numeric} -1 means not found
     */
    Array.prototype.reIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Add value to an array only if it not yet present.
     *
     * @param {Any} value Value to add to array.
     */
    Array.prototype.uniquePush = function(value) {
        if (this.indexOf(value) === -1) {
            this.push(value);
        }
    };


    /**
     * Capitalize first letter.
     *
     * @return {String} String where first letter is capitalized.
     */
    String.prototype.capitalize1stLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    /**
     * Determine if string is using object type notation.
     *
     * @return {Boolean} true if object notation used, false otherwise.
     */
    String.prototype.isObjectInput = function() {
        return (this.indexOf('.') > -1);
    };

    /**
     * Determine field input name of a string.
     *
     * @return {String} Input field name.
     */
    String.prototype.inputFieldName = function() {
        return (this.isObjectInput()) ? this.split('.')[0] : this.toString();
    };

    /**
     * Convert first letter of a string to lower case.
     *
     * @return {String} Converted string.
     */
    String.prototype.lowerCaseFirstLetter = function() {
        return this.charAt(0).toLowerCase() + this.slice(1);
    };


    /**
     * Set model's input field value.
     *
     * @param {Object} Input object.
     * @param {String} Property name within object.
     * @param {Object} value Property value.
     */
    Object.setModelFieldValue = function(model, field, value) {
        if (!field.isObjectInput()) {
            model[field] = value;
        }
        else {
            var ref = field.split('.');
            var obj = Object.resolveKey(model, ref.slice(0, ref.length - 1).join('.'));
            obj[ref[ref.length - 1]] = value;
        }
    };

    // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    //
    // Object.resolveKey(someObj, 'part3[0].name');
    Object.resolveKey = function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return null;
            }
        }
        return o;
    };

    jQuery.extend({
        sprintf: function(format) {
            var i = 1;
            var arg = arguments;
            return format.replace(/%((%)|s)/g, function (match) {
                return match[2] || arg[i++];
            });
        }
    });

    return ngDraal;
});
