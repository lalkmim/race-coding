var socket = null;
var editor = null;
var drivers = [];
var engines = [];
var tires = [];

$(document).ready(function() {
    editor = ace.edit("code-editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    
    $('div#help').dialog({
        autoOpen: false,
        width: 800,
        buttons: {
            OK: function() {
                $(this).dialog('close');
            }
        }
    });
    
    $('button#popupHelp').button().click(function() {
        $('div#help').dialog('open');
    });
    
    $('button#joinLeave').button().click(function() {
        if($(this).text() == '2) Join') {
            joinRace(socket);
            $(this).text('2) Leave (???)');
        } else {
            leaveRace(socket);
            $(this).text('2) Join');
        }
    });
    
    $('button#validate').button();
    
    $('button#send').button();
    
    socket = io.connect();
    
    buildSocketEventListeners(socket);
    
    getCurrentRaceStartTime(socket);
    getDrivers(socket);
    getEngines(socket);
    getTires(socket);
});

function startCountdown(sDate) {
    var startTime = (new Date(sDate)).standardFull().replace('-', '/').replace('-', '/');
    
    $('span#timer').countdown(startTime).on('update.countdown', function(event) {
        $(this).html(event.strftime('%M:%S'));
    }).on('finish.countdown', function(event) {
        loadRaceData(socket);
    });
}