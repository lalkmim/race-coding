var config = require('./config');
var RaceManager = require('./raceManager');

var raceManager = new RaceManager();

raceManager.loadDrivers(3);
raceManager.loadEngines(3);
raceManager.loadTires(0);
raceManager.createFirstRace(true);

setTimeout(function() { raceManager.processNextRace(false); }, (raceManager.currentRace.startTime - new Date()));

module.exports = raceManager;