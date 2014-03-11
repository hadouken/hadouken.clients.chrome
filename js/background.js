// Handle test connection
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === 'test-connection') {
            $.jsonRPC.request('core.getVersion', {
                endPoint: request.data.endpoint,
                username: request.data.username,
                password: request.data.password,
                success: function(v) { sendResponse({ success: true, version: v.result }); },
                error: function() { sendResponse({ success: false }); }
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

function addUrl(url, callback) {
    var options = getOptions();

    $.jsonRPC.request('torrents.addUrl', {
        params: [ url, '', '' ],
        endPoint: options.endpoint,
        username: options.username,
        password: options.password,
        success: function() { callback({ success: true }); },
        error: function() { callback({ success: false }); }
    });
}

function getOptions() {
    return JSON.parse(localStorage['options']);
}