const config = require('./config');

var Lap = require('./lap');
var CarLap = require('./carLap');

function RaceEngine() {}

RaceEngine.prototype.processGrid = function(race) {
    var startingGrid = new Lap(0, race.startingTemperature);
    for(var i=0; i<race.cars.length; i++) {
        var car = race.cars[i];
        var carLap = new CarLap(0, car, startingGrid, car.startingTire, car.startingFuel);
        carLap.tire.condition = 1;
        
        //console.log('>>> processGrid(carLap):', carLap);
        
        startingGrid.carsLap.push(carLap);
    }
    
    race.laps.push(startingGrid);
};

RaceEngine.prototype.processLap = function(race, lapNumber) {
    var previousLap = race.laps[lapNumber - 1];
    var temperature = this.calculateTemperature(previousLap.temperature);
    var lap = new Lap(lapNumber, temperature);
    
    lap.distancesToLeader.push(null);
    lap.positions.push(null);
    for(var i=0; i<race.cars.length; i++) {
        var car = race.cars[i];
        var previousCarLap = previousLap.getCarLap(car);
        var carLap = new CarLap(lapNumber, car, lap, previousCarLap.tire, previousCarLap.fuelTank);
        
        // LOAD PERMANENT PROBLEMS
        
        // UPDATE TIRE WEAR AND FUEL CONSUMPTION
        this.calculateTireWear(carLap, previousCarLap, race.track);
        this.calculateFuelConsumption(carLap, race.track, previousCarLap);
        
        // PIT TIME
        this.calculatePit(carLap);
        
        // CAR PROBLEMS
        this.calculateTireBlown(carLap, race.track, previousCarLap);
        this.calculateFuelTankEmpty(carLap);
        this.calculateRandomProblem(carLap, race.track);
        
        if(previousCarLap.stopped || carLap.stopped) {
            carLap.stopped = true;
            carLap.fuelTankEmpty = true;
            
            lap.carsLap.push(carLap);
            lap.positions.push(carLap);
            
            continue;
        }
        
        // DRIVER ERRORS
        this.calculateDriverError(carLap, race.track);
        
        // CALCULATE LAP TIME
        this.calculateTirePerformance(carLap);
        this.calculateEnginePerformance(carLap);
        this.calculateDriverPerformance(carLap);
        this.calculateCarPerformance(carLap, race.track);
        this.calculateLapTime(carLap, race.track);
        
        lap.carsLap.push(carLap);
        lap.positions.push(carLap);
    }
    
    // OVERTAKINGS AND DEFENDINGS - separate loop because it's necessary to have all lap times calculated
    for(var j=1; j<=lap.positions.length; j++) {
        
        
    }
    
    race.laps.push(lap);
};

RaceEngine.prototype.calculateTemperature = function(previousTemperature) {
    var chanceToChangeTemperature = (100 - config.TRACK_MAINTAIN_TEMPERATURE_PERCENTAGE) / (2 * 100);
    var temperature = previousTemperature;
    var randomNumber = Math.random();
    
    if(randomNumber < chanceToChangeTemperature) {
        temperature--;
    } else if(randomNumber > (1 - chanceToChangeTemperature)) {
        temperature++;
    }
    
    return temperature;
};

RaceEngine.prototype.calculateTireWear = function(carLap, previousCarLap, track) {
    carLap.tire = previousCarLap.tire;
    
    var condition = (track.length / 1000);
    condition = condition / carLap.tire.kmAt20Celsius;
    condition = condition * (1 + this.extraTemperatureWear(carLap.lap.temperature));
    condition += (rnd(0, 2*config.TIRE_WEAR_STANDARD_DEVIATION) / 1000);
    condition = previousCarLap.tire.condition - condition;
    
    carLap.tire.condition = condition;
};

RaceEngine.prototype.calculateFuelConsumption = function(carLap, track, previousCarLap) {
    var fuel = carLap.car.engine.fuelConsumptionRate * (track.length / 1000);
    fuel = fuel * (1 + (rnd(0, 2*config.ENGINE_FUEL_CONSUMPTION_STANDARD_DEVIATION) / 1000));
    fuel = previousCarLap.fuelTank - fuel;
    
    carLap.fuelTank = fuel;
};

RaceEngine.prototype.calculatePit = function(carLap) {
    if(carLap.pit.enter) {
        carLap.fuelTank += carLap.pit.fuel;
        
        if(carLap.fuelTank > carLap.car.engine.fuelTankSize) {
            carLap.fuelTank = carLap.car.engine.fuelTankSize;
        }
        
        if(carLap.pit.tireType !== null) {
            carLap.tire.condition = 1;
        }
    }
};

RaceEngine.prototype.calculateTireBlown = function(carLap, track, previousCarLap) {
    if(carLap.tire.condition < 0) {
        carLap.tire.blown = true;
        
        var blownTireTrackPosition = rnd(0, track.length);
        var performanceAfterBlownTire = rnd(config.TIRE_BLOWN_PERFORMANCE_PERCENTAGE_MIN, config.TIRE_BLOWN_PERFORMANCE_PERCENTAGE_RANGE);
        var avgSpeedAfterTireBlown = previousCarLap.avgSpeed * performanceAfterBlownTire / 100;
        var lostTime = ((track.length - blownTireTrackPosition) / avgSpeedAfterTireBlown) - (track.length / previousCarLap.avgSpeed);
        
        carLap.lostTime.tireBlown = lostTime;
        carLap.events.push({
           type: 'problem',
           message: 'Blown tire!'
        });
    }
};

RaceEngine.prototype.calculateFuelTankEmpty = function(carLap) {
    if(carLap.fuelTank < 0) {
        carLap.fuelTankEmpty = true;
        carLap.stopped = true;
        
        carLap.events.push({
           type: 'problem',
           message: 'Fuel tank empty! Race over!'
        });
    }
};

RaceEngine.prototype.calculateRandomProblem = function(carLap, track) {
    var chanceOfSuccess = Math.pow(carLap.car.engine.reliability, 1/track.totalLaps());
    var randomNumber = Math.random();
    
    if(randomNumber > chanceOfSuccess) {
        car.engine.randomProblem = true;
        
        carLap.lostTime.randomProblem = {
            performanceLoss: rnd(config.ENGINE_RANDOM_PROBLEM_PERFORMANCE_LOSS_MIN, config.ENGINE_RANDOM_PROBLEM_PERFORMANCE_LOSS_RANGE)
        };
        
        carLap.events.push({
           type: 'problem',
           message: 'Engine problem!'
        });
    }
};

RaceEngine.prototype.calculateDriverError = function(carLap, track) {
    var chanceOfSuccess = Math.pow(carLap.car.driver.reliability, 1/track.totalLaps());
    var randomNumber = Math.random();
    var additionalRisk = 0;
    
    if(carLap.push) {
        chanceOfSuccess = chanceOfSuccess * (1 - (carLap.car.driver.additionalRisk / 100));
    }
    
    if(randomNumber > chanceOfSuccess) {
        carLap.lostTime.driverError = rnd(config.DRIVER_ERROR_LOST_TIME_MIN, config.DRIVER_ERROR_LOST_TIME_RANGE);
        
        carLap.events.push({
           type: 'problem',
           message: 'Driver made a mistake, time lost!'
        });
    }
};

RaceEngine.prototype.calculateTirePerformance = function(carLap) {
    var tirePerformance = 1 - carLap.tire.condition;
    tirePerformance = Math.pow(tirePerformance, config.TIRE_PERFORMANCE_DROP_RATE);
    tirePerformance = (1 - tirePerformance) * carLap.tire.performance;
    
    carLap.performance.tire = tirePerformance / 100;
};

RaceEngine.prototype.calculateEnginePerformance = function(carLap) {
    var enginePerformance = carLap.fuelTank * config.ENGINE_HP_LOSS_RATE_PER_FUEL_LITER / 100;
    enginePerformance = enginePerformance * carLap.car.engine.fuelTankSize;
    enginePerformance = carLap.car.engine.horsePower - enginePerformance;
    enginePerformance = enginePerformance / (config.ENGINE_HP_MIN + config.ENGINE_HP_RANGE);
    
    carLap.performance.engine = enginePerformance;
};

RaceEngine.prototype.calculateDriverPerformance = function(carLap) {
    var driverPerformance = ((100 - config.DRIVER_PERFORMANCE_PERCENTAGE_MIN) / config.DRIVER_SPEED_RANGE) * carLap.car.driver.speed;
    driverPerformance = (config.DRIVER_PERFORMANCE_PERCENTAGE_MIN + driverPerformance) / 100;
    driverPerformance = driverPerformance * (1 + (rnd(0, 2 * this.maxDriverDeviation(carLap.car.driver)) - this.maxDriverDeviation(carLap.car.driver)));
    
    carLap.performance.driver = driverPerformance;
};

RaceEngine.prototype.calculateCarPerformance = function(carLap, track) {
    var tirePerf = carLap.performance.tire * track.performanceRelevance.tire;
    var driverPerf = carLap.performance.driver * track.performanceRelevance.driver;
    var enginePerf = carLap.performance.engine * track.performanceRelevance.engine;
    
    var performance = (tirePerf + driverPerf + enginePerf) / 100;
    
    carLap.performance.car = performance;
};

RaceEngine.prototype.calculateLapTime = function(carLap, track) {
    var lapTime = carLap.performance.car * track.avgSpeed();
    lapTime = (track.length / 1000) / lapTime;
    lapTime = lapTime * 3600;
    
    carLap.lapTime = lapTime;
};

function rnd(min, range) {
    return min + parseInt(Math.random() * range, 10);
}

RaceEngine.prototype.extraTemperatureWear = function(lapTemperature) {
    var temp = lapTemperature - config.TRACK_START_TEMPERATURE_MIN + config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1;
    temp = temp / config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1;
    temp = Math.pow(temp, (1 / config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_2));
    temp--;
    
    return temp;
};

RaceEngine.prototype.maxDriverDeviation = function(driver) {
    return ((1 + (config.DRIVER_CONSISTENCY_RANGE - driver.consistency)) / 100);
};

module.exports = (new RaceEngine());