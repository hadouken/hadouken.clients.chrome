$(document).ready(function() {
    var iconUrl = chrome.extension.getURL('/images/icon20_white_nograd.png');

    $('a[href^="magnet:?xt=urn:btih:"]').each(function(item) {
        var el = $('<a href="javascript: void(0);" class="btn" style="color: #fff; width: 220px; margin-left: -3px; margin-right: 4px;"><i style="background: url(\'' + iconUrl + '\');"></i> Send to Hadouken</a>');
        $(this).before(el);
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