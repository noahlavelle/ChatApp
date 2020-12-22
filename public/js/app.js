var socket = io();

let channelName = 'info';

$('#channels').children().each(function () {
  if ($(this).attr('id') !== 'info') {
   $(this).hide();
  }
});


$('#chat').hide();
$('.sidebar').hide();
$('#message').hide();
$('.contentheader').hide();

$('#uname').submit(function (e) {
  $('.sidebar').fadeIn(() => {
    $('#message').fadeIn();
    $('.contentheader').fadeIn();
  });
  
  e.preventDefault();
  socket.emit('create name', $('#u').val());
  $('#u').val('');
  $('#signup').hide()
  $('#chat').show()
  return false;
});

$('#message').submit(function (e) {
  e.preventDefault();
  socket.emit('chat message', $('#m').val(), channelName);
  $('#m').val('');
  return false;
});

socket.on('chat message', function (msg, username, color, msgChannel) {
  if (validURL(msg) === true) {
    $(`#${msgChannel}`).append($(`<div style="margin-bottom:15px;><label style="color:#${color}!important;margin-bottom:15px;">${username}</label><br><a href="${msg}">${msg}</a>`))
    if (/(?:jpg|gif|png)/.test(msg)) {
      $(`#${msgChannel}`).append($(`<img src=${msg} class="displayImage">`))
    }
  } else {
    $(`#${msgChannel}`).append($(`<div style="margin-bottom:15px;"><label style="color:#${color}!important;">${username}</label><br><msg>${msg}</msg></div>`))
  }
});

socket.on('append user', function (users) {
  $('#onlineusers').html('')
  let keys = Object.keys(users);
  let final = ''
  
  for (let i of keys) {
    final += `<span style="color:#${users[i][1]};">${users[i][0]}</span><br>`
  }

  $('#onlineusers').html(final)
});

function changeChannel(channel) {
  $(`#${channelName}li`).attr('data-focused', 'false')
  $(`#${channelName}`).hide()
  $(`#${channel}li`).attr('data-focused', 'true')
  $(`#${channel}`).show()
  channelName = channel
  $('#m').attr('placeholder', `Message #${channelName}`);

  $('.contentheader').text(`${channelName} ${$(`#${channelName}`).attr('description')}`)
}

function validURL(str) {
  return /(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6}|:[0-9]{3,4})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(str)
}