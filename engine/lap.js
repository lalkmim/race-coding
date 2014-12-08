function Lap(lapNumber, temperature) {
    this.lapNumber = lapNumber;
    this.temperature = temperature;
    
    this.carsLap = [];
    this.distancesToLeader = [];
    this.positions = [];
}

Lap.prototype.getCarLap = function(car) {
    for(var i=0; i<this.carsLap.length; i++) {
        var carLap = this.carsLap[i];
        if(carLap.car.id === car.id) {
            return carLap;
        }
    }
    
    return null;
};

module.exports = Lap;