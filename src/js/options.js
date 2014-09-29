$(document).ready(function() {
    $('#btn-save').on('click', function(e) {
        e.preventDefault();
        
        var data = {
            host: $('#host').val(),
            port: parseInt($('#port').val(), 10),
            token: $('#token').val()
        };

        save(data);
    });

    $('#btn-test').on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        
        setStatus('Connecting...');
        btn.attr('disabled', true);

        var data = {
            host: $('#host').val(),
            port: parseInt($('#port').val(), 10),
            token: $('#token').val()
        };

        test(data, function() {
            btn.attr('disabled', false);
        });
    });

    chrome.runtime.sendMessage({type: 'load-options'}, function(response) {
        $('#host').val(response.data.host);
        $('#port').val(response.data.port);
        $('#token').val(response.data.token);
    });
});

function test(data, callback) {
    var message =  {
        type: 'test-connection',
        data: data
    };

    chrome.runtime.sendMessage(message, function(response) {
        if(response.success) {
            setStatus('Connection OK!');
        } else {
            setStatus('Failed to connect :(');
        }

        callback();
    });
}

function save(data) {
    var message = {
        type: 'save-options',
        data: data
    };

    chrome.runtime.sendMessage(message, function(response) {
        if(response.success) {
            setStatus('Settings saved!');
        } else {
            setStatus('Could not save settings :(');
        }
    });
}

function setStatus(text) {
    $('#statustext').text(text);
}