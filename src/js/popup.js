(function(document, chrome, undefined) {

    function addRow(torrent, template) {
        var container = document.createElement('div');
        container.innerHTML = template;

        var item = container.children[0];
        item.setAttribute('data-id', torrent.InfoHash);

        document.getElementById('torrents').appendChild(item);
    }

    function getFirstChildByClassName(parent, className) {
        for(var i = 0; i < parent.childNodes.length; i++) {
            if(parent.childNodes[i].className == className) {
                return parent.childNodes[i];
            }
        }
    }

    function getTemplate() {
        return document.getElementById('torrent-item').innerHTML;
    }

    function getTorrents(callback) {
        chrome.runtime.sendMessage({ type: 'get-torrents' }, function(response) {
            callback(response.data);
        });
    }

    function updateTorrents(torrents) {
        for(var infoHash in torrents) {
            var torrent = torrents[infoHash];
            var item = document.querySelector('li[data-id="' + infoHash + '"]');

            getFirstChildByClassName(item, 'title').innerText = torrent.Name;
            getFirstChildByClassName(item, 'progress').value = torrent.Progress * 100;
        }

        setTimeout(function() {
            getTorrents(function(t) {
                updateTorrents(t);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        var template = getTemplate();

        getTorrents(function(torrents) {
            for(var infoHash in torrents) {
                var torrent = torrents[infoHash];
                addRow(torrent, template);
            }

            updateTorrents(torrents);
        });

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(request.type === 'torrent-added') {
                    var template = getTemplate();
                    addRow(request.data, template);
                }
            }
        );
    });
})(document, chrome);