$(document).ready(function() {
    $('a[href$=".torrent"]').on('click', function(e) {
        e.preventDefault();
        sendUrl($(this).attr('href'));
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