$(document).ready(function() {
    $('#btn-save').on('click', function(e) {
        e.preventDefault();
        
        var data = {
            endpoint: $('#endpoint').val(),
            username: $('#username').val(),
            password: $('#password').val()
        };

        save(data);
    });

    $('#btn-test').on('click', function(e) {
        e.preventDefault();

        var data = {
            endpoint: $('#endpoint').val(),
            username: $('#username').val(),
            password: $('#password').val()
        };

        test(data);
    });

    chrome.runtime.sendMessage({type: 'load-options'}, function(response) {
        console.log(response);
        
        $('#endpoint').val(response.data.endpoint);
        $('#username').val(response.data.username);
        $('#password').val(response.data.password);
    });
});

function test(data) {
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