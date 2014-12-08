const config = require('./config');
const RaceEngine = require('./raceEngine');

var Race = require('./race');
var Driver = require('./driver');
var Engine = require('./engine');
var Tire = require('./tire');
var Track = require('./track');

function RaceManager() {
    this.races = [];
    this.drivers = [];
    this.engines = [];
    this.tires = [];
    this.tracks = [];
    
    this.nextRacePos = -1;
    this.currentRace = null;
    this.raceEngine = RaceEngine;
}

RaceManager.prototype.createRace = function(shouldCreateTrack) {
    var selectedTrack = this.selectRandomTrack(shouldCreateTrack);
    var startingTemperature = config.TRACK_START_TEMPERATURE_MIN + parseInt(Math.random() * config.TRACK_START_TEMPERATURE_RANGE, 10);
    
    var race = new Race(selectedTrack, startingTemperature);
    
    if(this.nextRacePos < 0) {
        race.startTime = new Date();
        race.startTime.setMinutes(race.startTime.getMinutes() + config.RACE_INTERVAL + 1);
        race.startTime.setSeconds(0);
        race.startTime.setMilliseconds(0);
        
        this.nextRacePos = 0;
        this.currentRace = race;
    } else {
        race.startTime = new Date(this.races[this.races.length - 1].startTime);
        race.startTime.setMinutes(race.startTime.getMinutes() + config.RACE_INTERVAL);
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
    this.currentRace = this.races[pos];
    var race = this.currentRace;
    race.status = config.RACE_PROCESSING;
    
    if(race.cars.length === 0) {
        race.status = config.RACE_PROCESSED;
        this.currentRace = null;
        this.lastRace = race;
        throw {
            id: 3,
            msg: 'Race ended, no drivers to race.'
        };
    }
    
    this.raceEngine.processGrid(race);
    for(var i=1; i<=race.track.totalLaps(); i++) {
        this.raceEngine.processLap(race, i);
    }
    
    race.status = config.RACE_PROCESSED;
    this.lastRace = race;
    this.nextRacePos++;
    
    console.log('>>> processRace.finished');
}

RaceManager.prototype.cancelRace = function(pos) {
    var race = this.races[pos];
    race.status = RACE_CANCELLED;
    if(race == this.currentRace) {
        
    }
};

RaceManager.prototype.getCurrentRaceStartTime = function() {
    if(this.currentRace === null) {
        throw {
            id: 4,
            msg: 'No race available.'
        };
    }
    
    return this.currentRace.startTime;
};

RaceManager.prototype.generateRandomTrack = function() {
    var id = rnd(1, config.TRACK_ID_GENERATOR_RANGE);
    var name = 'Track #' + id;
    
    var straights = {
        percentual: rnd(config.TRACK_STRAIGHTS_PERCENTAGE_MIN, config.TRACK_STRAIGHTS_PERCENTAGE_RANGE),
        avgSpeed: rnd(config.TRACK_STRAIGHTS_AVG_SPEED_MIN, config.TRACK_STRAIGHTS_AVG_SPEED_RANGE)
    };
    
    var curves = {
        percentual: 100 - straights.percentual,
        avgSpeed: rnd(config.TRACK_CURVES_AVG_SPEED_MIN, config.TRACK_CURVES_AVG_SPEED_RANGE)
    };
    
    var length = rnd(config.TRACK_LENGTH_MIN, config.TRACK_LENGTH_RANGE);
    
    var performanceRelevance = {
      driver: rnd(config.TRACK_PERFORMANCE_RELEVANCE_DRIVER_MIN, config.TRACK_PERFORMANCE_RELEVANCE_DRIVER_RANGE),
      engine: rnd(config.TRACK_PERFORMANCE_RELEVANCE_ENGINE_MIN, config.TRACK_PERFORMANCE_RELEVANCE_ENGINE_RANGE)
    };
    performanceRelevance.tire = 100 - performanceRelevance.driver - performanceRelevance.engine;
    
    var track = new Track(id, name, length, straights, curves, performanceRelevance);
    
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
    var id = rnd(1, config.ENGINE_ID_GENERATOR_RANGE);
    var name = 'Engine #' + id;
    var reliability = rnd(config.ENGINE_RELIABILITY_MIN, config.ENGINE_RELIABILITY_RANGE);
    var fuelConsumptionRate = rnd(config.ENGINE_FUEL_CONSUMPTION_RATE_MIN, config.ENGINE_FUEL_CONSUMPTION_RATE_RANGE) / 100;
    var fuelTankSize = rnd(config.ENGINE_FUEL_TANK_SIZE_MIN, config.ENGINE_FUEL_TANK_SIZE_RANGE);
    var horsePower = rnd(config.ENGINE_HP_MIN, config.ENGINE_HP_RANGE);
    
    return new Engine(id, name, reliability, fuelConsumptionRate, fuelTankSize, horsePower);
};

RaceManager.prototype.generateRandomTire = function() {
    var id = rnd(1, config.TIRE_ID_GENERATOR_RANGE);
    var name = 'Tire #' + id;
    
    var soft = {
        type: 'soft',
        kmAt20Celsius: rnd(config.TIRE_SOFT_KM_AT_20_CELSIUS_MIN, config.TIRE_SOFT_KM_AT_20_CELSIUS_RANGE),
        performance: config.TIRE_SOFT_PERFORMANCE_PERCENTAGE
    };
    
    var medium = {
        type: 'medium',
        kmAt20Celsius: rnd(config.TIRE_MEDIUM_KM_AT_20_CELSIUS_MIN, config.TIRE_MEDIUM_KM_AT_20_CELSIUS_RANGE),
        performance: rnd(config.TIRE_MEDIUM_PERFORMANCE_PERCENTAGE_MIN, config.TIRE_MEDIUM_PERFORMANCE_PERCENTAGE_RANGE)
    };
    
    var hard = {
        type: 'hard',
        kmAt20Celsius: rnd(config.TIRE_HARD_KM_AT_20_CELSIUS_MIN, config.TIRE_HARD_KM_AT_20_CELSIUS_RANGE),
        performance: rnd(config.TIRE_HARD_PERFORMANCE_PERCENTAGE_MIN, config.TIRE_HARD_PERFORMANCE_PERCENTAGE_RANGE)
    };
    
    return new Tire(id, name, soft, medium, hard);
};


RaceManager.prototype.raceReport = function(race) {
    var laps = [];
    
    for(var i=0; i<race.laps.length; i++) {
        var lap = race.laps[i];
        var reportLap = {
            lapNumber: i,
            cars: []
        };
        for(var j=0; j<lap.carsLap.length; j++) {
            var carLap = lap.carsLap[j];
            reportLap.cars.push({
                id: carLap.car.id,
                lapTime: carLap.lapTime,
                events: carLap.events
            });
        }
        laps.push(reportLap);
    }
    
    return laps;
};


function rnd(min, range) {
    return min + parseInt(Math.random() * range, 10);
}

module.exports = RaceManager;