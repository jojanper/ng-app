module.exports = function() {
    return {
        dist : {
            src: ['scripts/**/*.js', '!scripts/**/directives/*.js'],
            options: {
                destination: '<%= docsPath %>/js-docs'
            }
        }
    };
};
