function CarLap(lapNumber, car) {
    this.lapNumber = lapNumber;
    this.car = car;
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
}

module.exports = CarLap;