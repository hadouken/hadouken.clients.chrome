var request = require('request');

module.exports = function(grunt) {
    grunt.registerMultiTask('webstorepublish', 'Published the specified zip file to the Chrome Web Store', function() {
        var done = this.async();

        var options = this.options({
            token_url: 'https://accounts.google.com/o/oauth2/token'
        });

        if(!options.package) {
            grunt.fatal('"package" not specified.');
        }

        if(!options.client_id) {
            grunt.fatal('"client_id" not specified.');
        }

        if(!options.client_secret) {
            grunt.fatal('"client_secret" not specified.');
        }

        if(!options.refresh_token) {
            grunt.fatal('"refresh_token" not specified.');
        }

        var access_token_form = {
            refresh_token: options.refresh_token,
            client_id: options.client_id,
            client_secret: options.client_secret,
            grant_type: 'refresh_token'
        };

        // Get access token
        request.post(options.token_url, { form: access_token_form }, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var d = JSON.parse(body);
                var access_token = d.access_token;

                grunt.log.writeln(access_token);
            } else {
                grunt.warn('Could not request an access token.');
            }

            done();
        });
    });
};