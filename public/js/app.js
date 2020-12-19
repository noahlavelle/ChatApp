var socket = io();

let channelName = 'info';

$('#chat').hide();

$('#uname').submit(function (e) {
  e.preventDefault();
  socket.emit('create name', $('#u').val());
  $('#u').val('');
  $('#signup').hide()
  $('#chat').show()
  return false;
});

$('#message').submit(function (e) {
  e.preventDefault();
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function (msg, username, color) {
  if (validURL(msg) === true) {
    $(`#${channelName}`).append($(`<div style="margin-bottom:15px;><label style="color:#${color}!important;">${username}</label><br><a href="${msg}">${msg}</a>`))
    if (/(?:jpg|gif|png)/.test(msg)) {
      $(`#${channelName}`).append($(`<img src=${msg} class="displayImage">`))
    }
  } else {
    $(`#${channelName}`).append($(`<div style="margin-bottom:15px;"><label style="color:#${color}!important;">${username}</label><br><msg>${msg}</msg></div>`))
  }
});

function changeChannel(channel) {
  $(`#${channelName}li`).attr('data-focused', 'false')
  $(`#${channelName}`).hide()
  $(`#${channel}li`).attr('data-focused', 'true')
  $(`#${channel}`).show()
  channelName = channel
  $('#m').attr('placeholder', `Message #${channelName}`);
}

function validURL(str) {
  return /(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6}|:[0-9]{3,4})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(str)
}