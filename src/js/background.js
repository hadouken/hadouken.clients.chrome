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

            } else if (request.type === 'add-url') {
                addUrl(request.data, sendResponse);
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

    function addUrl(url, callback) {
        _getFormattedOptions(function(opts) {
            if(!opts.valid) {
                return;
            }

            $.jsonRPC.request('torrents.addUrl', {
                params: [ url, '', '' ],
                endPoint: options.url,
                token: options.token,
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
        });
    }

    function _getFormattedOptions(callback) {
        storage.sync.get('options', function(response) {
            var options = response['options'];

            if(typeof options === 'undefined') {
                callback({ valid: false });
            }

            if(typeof options.host === 'undefined'
                || typeof options.port === 'undefined'
                || typeof options.token === 'undefined') {
                callback({ valid: false });
            }

            callback({
                url: 'http://' + options.host + ':' + options.port + '/jsonrpc',
                token: options.token,
                valid: true
            });
        });
    }

    function torrentAdded(torrent) {
        runtime.sendMessage({ type: 'torrent-added', data: torrent });
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
                        firstTimeout = false;
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

                    setTimeout(getTorrents, 1000);
                }
            });
        })
    }

    // Start loop
    getTorrents();

})(chrome.runtime, chrome.storage);