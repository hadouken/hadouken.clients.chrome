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
                    { src: ['**/*.*'], dest: 'build/<%= pkg.name %>-<%= version %>/', cwd: 'src/', expand: true }
                ]
            }
        },

        setversion: {
            main: {
                options: {
                    manifest_file: 'build/<%= pkg.name %>-<%= version %>/manifest.json',
                    version: '<%= version %>'
                }
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'build/<%= pkg.name %>-<%= version %>.zip'
                },
                files: [
                    { src: ['**/*.*'], dest: '/', cwd: 'build/<%= pkg.name %>-<%= version %>/', expand: true }
                ]
            }
        },

        webstorepublish: {
            main: {
                options: {
                    package: 'build/<%= pkg.name %>-<%= version %>.zip',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    code: process.env.CODE
                }
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

    // Publish task
    grunt.registerTask('publish', ['default', 'webstorepublish']);
};