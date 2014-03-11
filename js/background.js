// Handle test connection
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === 'test-connection') {
            $.jsonRPC.request('core.plugins.list', {
                endPoint: request.data.endpoint,
                username: request.data.username,
                password: request.data.password,
                success: function() { sendResponse({ success: true }); },
                error: function() { sendResponse({ success: false }); }
            });

            return true;
        } else if (request.type === 'save-options') {
            localStorage['options'] = JSON.stringify(request.data);
            sendResponse({ success: true });
        } else if (request.type === 'load-options') {
            sendResponse({data: JSON.parse(localStorage['options'])});
        }
    }
);