const config = require('./config');

var Race = require('./race');
var Driver = require('./driver');
var Engine = require('./engine');
var Tire = require('./tire');
var Track = require('./track');

function RaceManager(minTemp) {
    this.races = [];
    this.drivers = [];
    this.engines = [];
    this.tires = [];
    this.tracks = [];
    this.nextRacePos = -1;
    this.currentRace = null;
}

RaceManager.prototype.raceEngine = require('./raceEngine');

RaceManager.prototype.createRace = function(shouldCreateTrack) {
    var selectedTrack = this.selectRandomTrack(shouldCreateTrack);
    var startingTemperature = config.START_TEMPERATURE_MINIMUM + parseInt(Math.random() * config.START_TEMPERATURE_RANGE, 10);
    
    var race = new Race(selectedTrack, startingTemperature);
    
    if(this.nextRacePos < 0) {
        race.startTime = new Date();
        race.startTime.setMinutes(race.startTime.getMinutes() + config.RACE_INTERVAL + 1);
        race.startTime.setSeconds(0);
        race.startTime.setMilliseconds(0);
    } else {
        race.startTime = this.races[this.races.length - 1].startTime;
        race.startTime.setMinutes(startTime.getMinutes() + config.RACE_INTERVAL);
    }
    
    this.races.push(race);
};

RaceManager.prototype.selectRandomTrack = function(shouldCreateTrack) {
    if(this.tracks.length === 0) {
        if(shouldCreateTrack) {
            this.generateRandomTrack();
        } else {
            throw {
                id: 1,
                msg: 'No available tracks.'
            };
        }
    }
    
    var pos = parseInt(Math.random() * this.tracks.length, 10);
    
    return this.tracks[pos];
};

RaceManager.prototype.createFirstRace = function(shouldCreateTrack) {
    this.createRace(shouldCreateTrack);
    this.nextRacePos = 0;
    this.currentRace = this.races[this.nextRacePos];
};

RaceManager.prototype.processNextRace = function(shouldCreateRace) {
    if(this.nextRacePos < 0) {
        if(shouldCreateRace) {
            if(this.tracks.length === 0) {
                this.generateRandomTrack();
            }
            this.createRace();
            this.nextRacePos = 0;
            this.currentRace = this.races[this.nextRacePos];
        } else {
            throw {
                id: 2,
                msg: 'No available races to run.'
            };
        }
    } else {
        this.processRace(this.nextRacePos);
    }
};

RaceManager.prototype.processRace = function(pos) {
    var race = this.races[pos];
    this.currentRace = this.races[pos];
    
    if(race.drivers.length === 0) {
        race.processed = true;
        this.currentRace = null;
        this.lastRace = race;
        throw {
            id: 3,
            msg: 'Race ended, no drivers to race.'
        };
    }
    
    for(var i=0; i<race.laps.length; i++) {
        this.processLap(race, i);
    }
    race.processed = true;
    this.lastRace = race;
    this.currentRace = null;
    this.nextRacePos++;
};

RaceManager.prototype.cancelRace = function(pos) {
    var race = this.races[pos];
    race.processed = true;
    race.cancelled = true;
    if(race == this.currentRace) {
        
    }
};

RaceManager.prototype.getCurrentRaceStartTime = function() {
    console.log('currentRace:', this.currentRace);
    if(this.currentRace === null) {
        throw {
            id: 4,
            msg: 'No race available.'
        };
    }
    
    return this.currentRace.startTime;
};

RaceManager.prototype.generateRandomTrack = function() {
    var id = parseInt(Math.random() * config.TRACK_ID_GENERATOR_RANGE, 10);
    var name = 'Generated track #' + id;
    var straights = {
        percentual: config.TRACK_STRAIGHTS_PERCENTAGE_MINIMUM + parseInt(Math.random() * config.TRACK_STRAIGHTS_PERCENTAGE_RANGE, 10),
        avgSpeed: config.TRACK_STRAIGHTS_AVG_SPEED_MINIMUM + parseInt(Math.random() * config.TRACK_STRAIGHTS_AVG_SPEED_RANGE, 10)
    };
    var curves = {
        percentual: 100 - straights.percentual,
        avgSpeed: config.TRACK_CURVES_AVG_SPEED_MINIMUM + parseInt(Math.random() * config.TRACK_CURVES_AVG_SPEED_RANGE, 10)
    };
    var length = config.TRACK_LENGTH_MINIMUM + parseInt(Math.random() * config.TRACK_LENGTH_RANGE, 10);
    
    var track = new Track(id, name, length, straights, curves);
    
    this.tracks.push(track);
};

RaceManager.prototype.loadDrivers = function(numberGeneratedDrivers) {
    for(var i=0; i<numberGeneratedDrivers; i++) {
        var driver = this.generateRandomDriver();
        this.drivers.push(driver);
    }
};

RaceManager.prototype.loadEngines = function(numberGeneratedEngines) {
    for(var i=0; i<numberGeneratedEngines; i++) {
        var engine = this.generateRandomEngine();
        this.engines.push(engine);
    }
};

RaceManager.prototype.loadTires = function(numberGeneratedTires) {
    for(var i=0; i<numberGeneratedTires; i++) {
        var tire = this.generateRandomTire();
        this.tires.push(tire);
    }
};

RaceManager.prototype.generateRandomDriver = function() {
    var id = rnd(1, config.DRIVER_ID_GENERATOR_RANGE);
    var name = 'Driver #' + id;
    var speed = rnd(config.DRIVER_SPEED_MIN, config.DRIVER_SPEED_RANGE);
    var reliability = rnd(config.DRIVER_RELIABILITY_MIN, config.DRIVER_RELIABILITY_RANGE);
    var consistency = rnd(config.DRIVER_CONSISTENCY_MIN, config.DRIVER_CONSISTENCY_RANGE);
    var overtaking = rnd(config.DRIVER_OVERTAKING_MIN, config.DRIVER_OVERTAKING_RANGE);
    var defending = rnd(config.DRIVER_DEFENDING_MIN, config.DRIVER_DEFENDING_RANGE);
    
    return new Driver(id, name, speed, reliability, consistency, overtaking, defending);
};

RaceManager.prototype.generateRandomEngine = function() {
    
};

RaceManager.prototype.generateRandomTire = function() {
    
};

function rnd(min, range) {
    return min + parseInt(Math.random() * range, 10);
}

module.exports = RaceManager;