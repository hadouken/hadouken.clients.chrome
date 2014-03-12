module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compress: {
            main: {
                options: {
                    archive: 'build/hadouken.extensions.chrome.zip'
                },
                files: [
                    { src: ['**/*.*'], dest: '/', cwd: 'src/', expand: true }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task should be minify, compress
    grunt.registerTask('default', ['compress']);
};