const config = require('./config');

function Race(track, startingTemp) {
    this.status = config.RACE_PENDING;
    this.laps = [];
    this.cars = [];
    
    this.track = track;
    this.startingTemperature = startingTemp;
}

module.exports = Race;