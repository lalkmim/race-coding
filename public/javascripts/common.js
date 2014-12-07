Date.fromBR = function(txt) {
	return new Date(txt.split('/')[2], parseInt(txt.split('/')[1], 10)-1, txt.split('/')[0], 0, 0, 0);
}

Date.prototype.standard = function() {
	return this.getFullYear() + '-' + zeros(this.getMonth()+1, 2) + '-' + zeros(this.getDate(), 2);
}

Date.prototype.standardFull = function() {
	return this.standard() + ' ' + zeros(this.getHours(), 2) + ':' + zeros(this.getMinutes(), 2) + ':' + zeros(this.getSeconds(), 2);
}

Date.prototype.toBR = function() {
	return zeros(this.getDate(), 2) + '/' + zeros(this.getMonth()+1, 2) + '/' + this.getFullYear();
}

Date.prototype.addDias = function(dias) {
	var temp = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	temp.setDate(this.getDate() + dias);
	return temp;
}

Date.prototype.addHoras = function(horas) {
	var temp = new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getMilliseconds());
	temp.setHours(this.getHours() + horas);
	return temp;
}

Date.prototype.addMinutos = function(minutos) {
	var temp = new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getMilliseconds());
	temp.setMinutes(this.getMinutes() + minutos);
	return temp;
}

Date.prototype.addHoraMinuto = function(horario) {
	var horas = parseInt(horario.substring(0, horario.indexOf(':')), 10);
	var minutos = parseInt(horario.substring(horario.indexOf(':') + 1), 10);
	
	return this.addHoras(horas).addMinutos(minutos);
}

function zeros(val, qtd) {
	var temp = val + '';
	while(temp.length < qtd) {
		temp = '0' + temp;
	}
	return temp;
}

var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];