$(document).ready(function() {
    var iconUrl = chrome.extension.getURL('/images/icon16.png');

    $('a[href$=".torrent"]').each(function(item) {
        var el = $('<a href="#"><img src="' + iconUrl + '" /></a>');
        $(this).after(el);
        var url = $(this).attr('href');

        el.on('click', function(e) {
        	sendUrl(url);
        });
    });
});

function sendUrl(url) {
    var message = {
        type: 'add-url',
        data: location.protocol + url
    };

    chrome.runtime.sendMessage(message, function(response) {
        if(response.success) {
            console.log('whoo!');
        }
    });
}