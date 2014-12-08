var config = require('./config');
var RaceManager = require('./raceManager');

var raceManager = new RaceManager();

raceManager.loadDrivers(3);
raceManager.loadEngines(3);
raceManager.loadTires(1);

for(var i=0; i<5; i++) {
    raceManager.createRace(true);
}

console.log('raceManager:', raceManager);

setTimeout(function() { 
//    try {
        raceManager.processNextRace(false);
//    } catch(e) {
//        console.log('Race aborted', e);
//    }
}, 15000);
//}, (raceManager.currentRace.startTime - new Date()));

module.exports = raceManager;