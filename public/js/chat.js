var socket = io();

function scrollToBottom() {
    // selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // height
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeigth = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeigth >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no err')
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    var ol = $('<ol></ol>');
    users.forEach(function (user) {
        ol.append($('<li></li>').text(user))
    });

    $('#users').html(ol);
    console.log('Users List', users);
})

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a')
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
})

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});

var messageTextbox = $('[name=message]');
$('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('')
    });
})

var locationButton = $('#send-location');
locationButton.on('click', function ($event) {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location ...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function (data) {
            console.log(data);
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Geolocation not fetched');
    })
})