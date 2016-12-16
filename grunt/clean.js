module.exports = function() {
    return {
        build_clean: {
            src: ['<%= testReportsPath %>/*.xml', '<%= testReportsPath %>/xmlrunner/*.xml']
        }
    };
};
