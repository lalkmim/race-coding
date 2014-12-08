function CarLap(lapNumber, car, lap, startingTire, startingFuel) {
    this.lapNumber = lapNumber;
    this.car = car;
    this.lap = lap;
    this.events = [];
    this.lostTime = {
        tireBlown: null,
        randomProblem: null,
        driverError: null
    };
    this.pit = {
        enter: false,
        tireType: null,
        fuel: 0
    };
    
    this.tire = startingTire;
    this.fuelTank = startingFuel;
    
    this.performance = {
        driver: null,
        engine: null,
        tire: null,
        car: null
    };
}

module.exports = CarLap;