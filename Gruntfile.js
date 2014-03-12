module.exports = function(grunt) {
    var version = '0.0.0';

    if(typeof process.env.VERSION !== 'undefined') {
        version = process.env.VERSION;
    }

    grunt.initConfig({
        version: version,

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

    // Default task should be clean, copy, setversion, compress
    grunt.registerTask('default', ['clean', 'copy', 'setversion', 'compress']);

    // setversion task
    grunt.registerMultiTask('setversion', 'Sets the version in the manifest.json file', function() {
        var options = this.options({
            manifest_file: 'manifest.json',
            version: '0.0.0'
        });

        var manifest = grunt.file.readJSON(options.manifest_file);
        manifest.version = options.version;

        // Write new manifest file
        grunt.file.write(options.manifest_file, JSON.stringify(manifest, undefined, 2));
    });
};