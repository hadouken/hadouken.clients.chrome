module.exports = function(grunt) {
    grunt.registerMultiTask('webstorepublish', 'Published the specified zip file to the Chrome Web Store', function() {
        var options = this.options();

        if(!options.package) {
            grunt.fatal('"package" not specified.');
        }

        if(!options.client_id) {
            grunt.fatal('"client_id" not specified.');
        }

        if(!options.client_secret) {
            grunt.fatal('"client_secret" not specified.');
        }

        if(!options.code) {
            grunt.fatal('"code" not specified.');
        }
    });
};