var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    var li = $('<li></li>');
    li.text(message.from + ': ' + message.text);
    $('#messages').append(li);
})

socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message);
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current Location</a>')
    li.text(message.from + ': ');
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

var messageTextbox = $('[name=message]');
$('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
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