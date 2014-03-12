module.exports = function(grunt) {
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