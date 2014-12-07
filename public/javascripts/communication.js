function buildSocketEventListeners(socket) {
    socket.on('returnCurrentRaceStartTime', function(params) {
        var startTime = (new Date(params)).standardFull().replace('-', '/').replace('-', '/');
        $('span#timer').countdown(startTime).on('update.countdown', function(event) {
            $(this).html(event.strftime('%M:%S'));
        }).on('finish.countdown', function(event) {
            loadRaceData(socket);
        });
    });
    
    socket.on('returnAddRacer', function(params) {
        if(params.result) {
            $('<div>Your request to join this race was approved!</div>').dialog({ modal: true, buttons: { 'OK': function() { $(this).dialog('close'); } } });
        } else {
            $('<div>Your request to join this race was NOT approved! Sorry. :(</div>').dialog({ modal: true, buttons: { 'OK': function() { $(this).dialog('close'); } } });
        }
    });
    
    socket.on('returnDrivers', function(params) {
        drivers = params.drivers;
    });
    
    socket.on('returnEngines', function(params) {
        engines = params.engines;
    });
    
    socket.on('returnTires', function(params) {
        tires = params.tires;
    });
}

function getCurrentRaceStartTime(socket) {
    socket.emit('getCurrentRaceStartTime');
}

function loadRaceData() {
    console.log('>>> loadRaceData');
}

function joinRace(socket) {
    console.log('>>> joinRace');
    socket.emit('addRacer', { 
        driver: selectedDriver, 
        startingTire: selectedTire, 
        engine: selectedEngine
    });
}

function leaveRace(socket) {
    console.log('>>> leaveRace');
    socket.emit('removeRacer');
}

function getDrivers(socket) {
    console.log('>>> getDrivers');
    socket.emit('getDrivers');
}

function getEngines(socket) {
    console.log('>>> getEngines');
    socket.emit('getEngines');
}

function getTires(socket) {
    console.log('>>> getTires');
    socket.emit('getTires');
}