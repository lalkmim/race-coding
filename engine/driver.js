function Driver(id, name, speed, reliability, consistency, overtaking, defending) {
    this.id = id;
    this.name = name;
    this.speed = speed;
    this.reliability = reliability;
    this.consistency = consistency;
    this.overtaking = overtaking;
    this.defending = defending;
}

module.exports = Driver;