var request = require('request');
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

    function uploadPackage(endpoint, access_token, file, callback) {
        var opts = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'x-goog-api-version': '2'
            },
            url: endpoint
        };

        var f = request(opts, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                callback();
            } else {
                grunt.warn(error);
            }
        }).form();

        f.append(path.basename(file), fs.createReadStream(file));
    }

    function publishPackage(endpoint, access_token, callback) {
        var opts = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'x-goog-api-version': '2'
            },
        };

        request.post(endpoint, opts, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                callback();
            } else {
                grunt.warn(error);
            }
        });
    }

    grunt.registerMultiTask('webstorepublish', 'Published the specified zip file to the Chrome Web Store', function() {
        var done = this.async();

        var options = this.options({
            token_url: 'https://accounts.google.com/o/oauth2/token',
            upload_url: 'https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID$',
            publish_url: 'https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID$/publish'
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

        if(!options.app_id) {
            grunt.fatal('"app_id" not specified.');
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
                var uploadUrl = options.upload_url.replace('$APP_ID$', options.app_id);

                uploadPackage(uploadUrl, access_token, options.package, function() {

                    var publishUrl = options.publish_url.replace('$APP_ID$', options.app_id);
                    publishPackage(publishUrl, access_token, function() {
                        done();
                    });                
                });
            } else {
                grunt.warn('Could not request an access token.');
                done();
            }
        });
    });
};