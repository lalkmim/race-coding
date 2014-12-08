const config = require('./config');

function Driver(id, name, speed, reliability, consistency, overtaking, defending) {
    this.id = id;
    this.name = name;
    this.speed = speed;
    this.reliability = reliability;
    this.consistency = consistency;
    this.overtaking = overtaking;
    this.defending = defending;
    
    this.pushLaps = rnd(config.DRIVER_PUSH_LAPS_MIN, config.DRIVER_PUSH_LAPS_RANGE);
    this.additionalRisk = rnd(config.DRIVER_PUSH_LAPS_ADDITIONAL_RISK_PERCENTAGE_MIN, config.DRIVER_PUSH_LAPS_ADDITIONAL_RISK_PERCENTAGE_RANGE);
}

function rnd(min, range) {
    return min + parseInt(Math.random() * range, 10);
}

module.exports = Driver;