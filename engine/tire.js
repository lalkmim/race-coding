const config = require('./config');

function Tire(id, name, soft, medium, hard) {
    this.id = id;
    this.name = name;
    
    this.compounds = {
        soft: soft,
        medium: medium,
        hard: hard
    };
}

Tire.prototype.extraTemperatureWear = function(lapTemperature) {
    // ((temperature - 20 + TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1)/ TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1 )^(1/TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_2)-1
    var temp = lapTemperature - config.TRACK_START_TEMPERATURE_MIN + config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1;
    temp = temp / config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_1;
    temp = Math.pow(temp, (1 / config.TIRE_WEAR_TEMPERATURE_WEAR_CONSTANT_2));
    temp--;
    
    return temp;
}

module.exports = Tire;