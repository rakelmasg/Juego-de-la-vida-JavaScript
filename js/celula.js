/* 
*	Fecha creación: 28/11/2015
*	Autor: Raquel Más
*/

//constructor de célula
function Celula(v){
	
	//atributos
	var viva = v; //representa el estado: true(1) -> viva, false(0) -> muerta
	var turnosViva = (viva) ? 1 : 0; //número de turnos que ha sobrevivido
	
	//métodos 
	this.aumentarTurnosViva= function(){ turnosViva++;} //incrementa los turnos que ha sobrevivido
	
	this.getViva = function(){ return viva;} //devuelve el estado en forma booleana
	
	var getEstado = function(){ //devuelve el estado en forma escrita
		var estado=	(viva) ? "<span id='viva'>VIVA</span>": "<span id='muerta'>MUERTA</span>";
		return estado;
	}
	
	this.toString = function(){ //devuelve una cadena de texto con los datos de los atributos
		return "Estado: "+getEstado()+"<br>Turno/s viva: "+turnosViva;
	}

}