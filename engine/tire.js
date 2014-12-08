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

module.exports = Tire;