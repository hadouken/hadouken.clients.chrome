(function(runtime, storage, undefined) {

    var torrents = {};
    var firstTimeout = true;

    runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.type === 'test-connection') {
                testToken(request.data, function(result) {
                    sendResponse({ success: result });
                });

                return true;
            } else if (request.type === 'save-options') {
                
                storage.sync.set({ options: request.data }, function() {
                    sendResponse({ success: true });
                });

                return true;

            } else if (request.type === 'load-options') {
                
                storage.sync.get('options', function(response) {
                    sendResponse({ data: response['options'] });
                });

                return true;

            } else if (request.type === 'addMagnetLink') {
                addMagnetLink(request.data, sendResponse);
                return true;
            } else if (request.type === 'get-torrents') {
                sendResponse({ data: torrents });
            }
        }
    );

    function testToken(options, callback) {
        $.jsonRPC.request('torrents.getAll', {
            params: [],
            endPoint: 'http://' + options.host + ':' + options.port + '/jsonrpc',
            token: options.token,
            success: function() { callback(true); },
            error: function() { callback(false); }
        });
    }

    function addMagnetLink(url, callback) {
        _getFormattedOptions(function(opts) {
            if(!opts.valid) {
                return;
            }

            $.jsonRPC.request('torrents.addUrl', {
                params: [ url, {} ],
                endPoint: opts.url,
                token: opts.token,
                success: function(response) { callback({ success: true }); },
                error: function() { callback({ success: false }); }
            });
        });
    }

    function _getFormattedOptions(callback) {
        storage.sync.get('options', function(response) {
            var options = response['options'];

            if(typeof options === 'undefined') {
                callback({ valid: false });
                return;
            }

            if(typeof options.host === 'undefined'
                || typeof options.port === 'undefined'
                || typeof options.token === 'undefined') {
                callback({ valid: false });
                return;
            }

            callback({
                url: 'http://' + options.host + ':' + options.port + '/jsonrpc',
                token: options.token,
                valid: true
            });
        });
    }

    function sendNotification(notification) {
        var opt = {
            type: 'basic',
            title: notification.title,
            message: notification.message,
            iconUrl: '/images/icon128.png'
        };

        if(!notification.callback) {
            notification.callback = function() {}
        }

        chrome.notifications.create(notification.id, opt, function() { notification.callback() });
    }

    function torrentAdded(torrent) {
        runtime.sendMessage({ type: 'torrent-added', data: torrent });
        sendNotification({
            id: torrent.InfoHash,
            title: 'Torrent added',
            message: torrent.Name + ' added.'
        });
    }

    function torrentRemoved(infoHash) {
        runtime.sendMessage({ type: 'torrent-removed', data: infoHash });
    }

    function getTorrents() {
        _getFormattedOptions(function(options) {
            if(!options.valid) {
                setTimeout(getTorrents, 1000);
                return;
            }

            $.jsonRPC.request('torrents.getAll', {
                params: [],
                endPoint: options.url,
                token: options.token,
                error: function(d) { console.log(d); setTimeout(getTorrents, 5000); },
                success: function(data) {
                    for (var i = 0; i < data.result.length; i++) {
                        var torrent = data.result[i];

                        if(typeof torrents[torrent.InfoHash] === 'undefined' && !firstTimeout) {
                            torrentAdded(torrent);
                        }

                        torrents[torrent.InfoHash] = torrent;
                    }

                    if (data.result.length) {
                        var currentIdList = data.result.map(function(x) { return x.InfoHash; });
                        var selfIds = Object.keys(torrents);

                        for (var i = 0; i < selfIds.length; i++) {
                            if (currentIdList.indexOf(selfIds[i]) < 0) {
                                delete torrents[selfIds[i]];
                                torrentRemoved(selfIds[i]);
                            }
                        }
                    }

                    firstTimeout = false;
                    setTimeout(getTorrents, 1000);
                }
            });
        })
    }

    // Start loop
    getTorrents();

})(chrome.runtime, chrome.storage);