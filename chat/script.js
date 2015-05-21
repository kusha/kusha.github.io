function status(msg) {
    $('<h4>'+msg+'</h4>' ).insertBefore( ".input" );
}

function smooth_scroll(){
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

function play_notification() {
    var player = document.getElementById('notificator');
    player.pause();
    player.currentTime = 0;
    player.play();
}

function to_me(msg) {
    play_notification();
    $('<p class="to_me">'+msg+'</p>' ).insertBefore( ".input" );
    smooth_scroll();
}

function from_me(msg) {
    $('<p class="from_me">'+msg+'</p>' ).insertBefore( ".input" );
    smooth_scroll();
}

var input_editable = false;
function input_toggle(){ 
    $( ".input" ).toggleClass( "locked" );
    input_editable = ! input_editable;
    $(".input" ).attr('contenteditable', input_editable);
    play_notification();
}

var online_showed = false;
function show_online(number){ 
    if (!online_showed) {
        $('#info' ).append('<span id="online" class="label"><i class="fa fa-bolt"></i> '+number+'</span>');
        online_showed = true;
    } else {
        $('#online' ).html('<i class="fa fa-bolt"></i> '+number);
    }
}

var was_connected = false;
status('Пробуем присоединится к серверу');
var webSocket = new WebSocket('ws://178.62.192.111:8888/chat'); //178.62.192.111

webSocket.onopen = function (event) {
    was_connected = true;
};

webSocket.onmessage = function (event) {
    var parsedMsg = $.parseJSON(event.data);
    switch (parsedMsg.type) {
      case "service":
        if (parsedMsg.meta == "pairing")
            input_toggle();
        status(parsedMsg.text);
        break
      case "online":
        show_online(parsedMsg.number)
        break
      case "confirmation":
        from_me(parsedMsg.text);
        break
      case "message":
        to_me(parsedMsg.text);
        break
      default:
        alert('Wrong message')
    }
};

webSocket.onclose = function (event) {
    if (was_connected) {
        status('Соединение прервано');
    } else {
        status('Не удается найти сервер');
        status('Попробуйте <a href=".">обновить страницу</a>')
    }
};

$("body").on('keydown', '.input', function(e) {  
    if(e.keyCode == 13)
    {
        var msg = {};
        msg.text = $('.input').text();
        msg.type = "message";
        $('.input').text("");
        webSocket.send(JSON.stringify(msg));
        e.preventDefault();
    }
});