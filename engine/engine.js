function Engine(id, name, reliability, fuelConsumptionRate, fuelTankSize, horsePower) {
    this.id = id;
    this.name = name;
    this.reliability = reliability;
    this.fuelConsumptionRate = fuelConsumptionRate;
    this.fuelTankSize = fuelTankSize;
    this.horsePower = horsePower;
}

module.exports = Engine;