module.exports = function() {
    return {
        /**
         * Test shelljs script.
         */
        shelljs_test: {
            command: function(argv) {
                return 'node grunt/scripts/shell_test.js ' + argv;
            }
        },

        /**
         * Fix JSHint XML source file path references.
         */
        jshint_path_fix: {
            command: function(argv) {
                return 'node grunt/scripts/jshint_fix.js --path=<%= appPath %> --xmlfile=<%= jsHintXml %> ' + argv;
            }
        }
    };
};
