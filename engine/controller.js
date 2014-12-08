var config = require('./config');
var RaceManager = require('./raceManager');

var raceManager = new RaceManager();

raceManager.loadDrivers(3);
raceManager.loadEngines(3);
raceManager.loadTires(1);

for(var i=0; i<10; i++) {
    raceManager.createRace(true);
}

console.log('raceManager:', raceManager);

setTimeout(function() { raceManager.processNextRace(false); }, (raceManager.currentRace.startTime - new Date()));

module.exports = raceManager;