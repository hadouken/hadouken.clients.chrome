module.exports = function(grunt) {
    grunt.initConfig({
        version: process.env.VERSION || '0.0.0',

        pkg: grunt.file.readJSON('package.json'),

        clean: [
            'build/'
        ],

        copy: {
            main: {
                files: [
                    { src: ['**/*.*'], dest: 'build/hdkn.chrome-<%= version %>/', cwd: 'src/', expand: true }
                ]
            }
        },

        setversion: {
            main: {
                options: {
                    manifest_file: 'build/hdkn.chrome-<%= version %>/manifest.json',
                    version: '<%= version %>'
                }
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'build/hdkn.chrome-<%= version %>.zip'
                },
                files: [
                    { src: ['**/*.*'], dest: '/', cwd: 'build/hdkn.chrome-<%= version %>/', expand: true }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Load custom tasks
    grunt.loadTasks('tasks/');

    // Default task
    grunt.registerTask('default', ['clean', 'copy', 'setversion', 'compress']);
};