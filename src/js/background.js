// Handle test connection
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === 'test-connection') {
            getToken(request.data, function(token) {
                sendResponse({ success: true, version: token });
            });

            return true;
        } else if (request.type === 'save-options') {
            localStorage['options'] = JSON.stringify(request.data);
            sendResponse({ success: true });
        } else if (request.type === 'load-options') {
            sendResponse({data: JSON.parse(localStorage['options'])});
        } else if (request.type === 'add-url') {
            addUrl(request.data, sendResponse);
            return true;
        }
    }
);

function getToken(options, callback) {
    $.ajax({
        type: 'POST',
        url: 'http://' + options.host + ':' + options.port + '/auth/login',
        data: JSON.stringify({ UserName: options.username, Password: options.password }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            callback(data.token);
        }
    });
}

function addUrl(url, callback) {
    var options = getOptions();

    $.jsonRPC.request('torrents.addUrl', {
        params: [ url, '', '' ],
        endPoint: options.endpoint,
        username: options.username,
        password: options.password,
        success: function(response) {
            var opt = {
                type: 'basic',
                title: 'Torrent added',
                message: 'Successfully added torrent ' + response.result.Name,
                iconUrl: '/images/icon128.png'
            };

            chrome.notifications.create(response.result.Id, opt, function() { callback({ success: true }); });
        },
        error: function() { callback({ success: false }); }
    });
}

function getOptions() {
    return JSON.parse(localStorage['options']);
}