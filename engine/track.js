function Track(id, name, length, straights, curves, performanceRelevance) {
    this.id = id;
    this.name = name;
    this.length = length;
    this.straights = straights;
    this.curves = curves;
    this.performanceRelevance = performanceRelevance;
}

Track.prototype.km = function() {
    return this.length/1000;
}

Track.prototype.avgSpeed = function() {
    return (this.straights.percentual * this.straights.avgSpeed + this.curves.percentual * this.curves.avgSpeed) / 100;
}

Track.prototype.totalLaps = function() {
    const BASE_KM = 300;
    
    return parseInt(BASE_KM / this.km(), 10) + 1;
}

Track.prototype.totalKm = function() {
    return this.totalLaps() * this.km();
}

module.exports = Track;