module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        jshint: {
            src: {
                options: {jshintrc: '.jshintrc'},
                src: ['defined.js']
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
};