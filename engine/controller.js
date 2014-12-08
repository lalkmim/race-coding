var config = require('./config');
var RaceManager = require('./raceManager');

var raceManager = new RaceManager();

raceManager.loadDrivers(3);
raceManager.loadEngines(3);
raceManager.loadTires(1);

raceManager.createRace(true);

setTimeout(function() { 
    try {
        raceManager.processNextRace(true);
    } catch(e) {
        console.log('Race aborted', e);
    }
}, (raceManager.currentRace.startTime - new Date()));

module.exports = raceManager;