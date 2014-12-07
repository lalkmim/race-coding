function Race(track, startingTemp) {
    this.processed = false;
    this.cancelled = false;
    this.laps = [];
    
    this.track = track;
    this.startingTemperature = startingTemp;
}

module.exports = Race;