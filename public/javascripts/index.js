var socket = null;
var editor = null;
var drivers = [];
var engines = [];
var tires = [];
var lastRace = {};

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
    
    $('button#send').button().click(function() {
        var car = {
            id: parseInt(Math.random() * 1000000),
            driver: drivers[0], 
            engine: engines[0],
            tire: tires[0],
            startingTire: tires[0].compounds.soft,
            startingFuel: 50,
            orders: editor.getValue()
        };
        
        joinRace(socket, car);
        
        $(this).button('option', 'disabled', true);
    });
    
    $('button#send').button();
    
    $('button#lastRace').button().click(function() {
        getLastRace(socket);
    });
    
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