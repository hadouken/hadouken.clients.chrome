(function(document, chrome, undefined) {

    function getTorrents(callback) {
        chrome.runtime.sendMessage({ type: 'get-torrents' }, function(response) {
            callback(response.data);
        });
    }

    function updateTorrents(torrents) {
        var keys = Object.keys(torrents);

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var torrent = torrents[key];

            var li = document.createElement('li');
            li.innerText = torrent.Name;

            document.getElementById('torrents').appendChild(li);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        getTorrents(function(torrents) {
            updateTorrents(torrents);
        });
    });
})(document, chrome);