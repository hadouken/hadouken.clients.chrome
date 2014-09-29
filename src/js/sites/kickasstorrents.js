$(document).ready(function() {
    var iconUrl = chrome.extension.getURL('/images/icon24_golden_nograd.png');

    $('a[href^="magnet:?xt=urn:btih:"]').each(function(item) {
        var el = $('<a href="#" class="siteButton giantIcon"><img src="' + iconUrl + '" /></a>');
        $(this).after(el);
        var url = $(this).attr('href');

        el.on('click', function(e) {
            e.preventDefault();

            sendUrl(url, function(r) {
                if(r) {
                    el.remove();
                }
            });
        });
    });
});

function sendUrl(url, callback) {
    var message = {
        type: 'addMagnetLink',
        data: url
    };

    chrome.runtime.sendMessage(message, function(response) {
        callback(response.success);
    });
}