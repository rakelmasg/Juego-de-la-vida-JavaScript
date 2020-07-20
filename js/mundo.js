/* 
*	Fecha creación: 28/11/2015
*	Autor: Raquel Más
*/

//constructor del mundo
function Mundo(cv){
	
	//atributos
	var contexto = cv.getContext("2d"); //contexto del canvas sobre el que se va a pintar
	var tablero; //array bidimensional de células
	var numCelulas; //longitud del tablero expresado en nº de células
	var tamanioCelula; //tamaño por célula en pixels
	var numTurno=1; //número de turno desde que se inició el tablero
	
	//variables axiliares para marcar la célula sobre la que está el cursor
	var lastX=0; 
	var lastY=0;
	var lastV=0;
	
	//métodos
	var getCelula = function(x,y){ return tablero[x][y];} //devuelve la célula de esa posición del tablero
	
	var setCelula = function(x,y,cel){ tablero[x][y]=cel;} //coloca una célula esa posición del tablero
	
	var getVivaCelula = function(x,y){ return getCelula(x,y).getViva();} //devuelve el estado(0|1) de la célula en esa posición del tablero
	
	this.getNumCelulas = function(){ return numCelulas;} //devuelve la longitud del tablero en nº de células
	
	this.getNumTurno = function(){ return numTurno;} //devuelve el número de turno desde que se inició el tablero
	
	var aumentarNumTurno = function(){ numTurno++;} //incrementa el número de turno del tablero desde que se inició 
	
	var ajustarTamanioCelula = function (){ //cambia el tamaño las células en función de nº escogido
		if(numCelulas==5){ //para cuadrar el ancho del canvas
			tamanioCelula = Math.ceil((contexto.canvas.clientWidth-4)/numCelulas); //calcula el tamaño de la célula en función del tamaño del tablero
		}else{
			tamanioCelula = Math.ceil(((contexto.canvas.clientWidth-4)/numCelulas)-1);
		}
	}
	
	this.init = function(num){ //inicializa el mundo con el número indicado de células
		numTurno=1;
		numCelulas = num;
		ajustarTamanioCelula(); //calculamos el tamaño de las células 
		tablero=[]; //inicializamos el tablero
		for (var i=0;i<numCelulas;i++){
			tablero[i]= []; //inicializamos la segunda dimensión del tablero
			for (var j=0;j<numCelulas;j++){
				setCelula(i,j,new Celula(false));
			}
		}		
		contexto.fillStyle="#FFFFFF"; //cambiamos al color para pintar el fondo
		contexto.fillRect(0,0,contexto.canvas.clientWidth,contexto.canvas.clientWidth); //pintamos un fondo para simular la rejilla
		render(); //pintamos el tablero por primera vez
	}
	
	var evolucionar = function(){ //crea o destruye células teniendo en cuenta el estado de las vecinas
		var tableroNuevo= []; //tablero auxiliar donde se almacenan las nuevas células
		var vecinas=0; //número de células adyacentes vivas
		var cel; //célula auxiliar
		for (var i=0;i<numCelulas;i++){
			tableroNuevo[i]= []; //inicializamos la segunda dimensión del tablero auxiliar
			for (var j=0;j<numCelulas;j++){
				vecinas=contarVecinas(i,j); //contamos las vecinas vivas de la celula actual
				cel=getCelula(i,j); //recuperamos la célula actual
				if(getVivaCelula(i,j)==true){//si la célula está viva
					if(vecinas!=2 && vecinas!=3){ //si no tiene 2-3 vecinas vivas
						cel = new Celula(false); //se crea una celula muerta
					}else{ //si tiene menos de 2 o más de 3
						cel.aumentarTurnosViva(); //aumenta su tiempo de vida
					}
				}else{ //si está muerta
					if(vecinas==3){ //si tiene 3 vecinas vivas
						cel = new Celula(true); //se crea una célula viva
					}
				}
				tableroNuevo[i][j] = cel; //añadimos la célula actualizada en tablero axiliar
			}
		}
		tablero=tableroNuevo; //cambiamos el tablero original por el nuevo (auxiliar)
	}
	
	var contarVecinas = function(x, y) { //cuenta el nº de células vivas contiguas a la célula indicada del tablero
		var nVecinas = 0; //numero de vevinas vivas
		var iaux=0, jaux=0; //variables de posición auxiliares
		for (var i = x-1; i <= x+1; i++) { //recorremos sus vecinas en el tablero
			for (var j = y-1; j <= y+1; j++) {
					if(i==-1){ //si llegamos al límite buscamos en el otro extremo
						iaux=numCelulas-1;
					}else if(i==numCelulas){
						iaux=0;
					}else{ 
						iaux=i;
					}
					if(j==-1){ //si llegamos al límite buscamos en el otro extremo
						jaux=numCelulas-1;
					}else if(j==numCelulas){
						jaux=0;
					}else{
						jaux=j;
					}
					if(!(iaux==x && jaux==y)) //si la célula no es ella misma
					nVecinas += getVivaCelula(iaux,jaux); //aumentamos el nº de vecinas si está viva
			}
		}
		return nVecinas;//devolvemos el nº de vecinas vivas
	}
	
	var render = function(){ //pinta todas las células del tablero en el contexto
		for (var i=0;i<numCelulas;i++){ //recorremos el tablero
			for (var j=0;j<numCelulas;j++){ 
				renderCelula(i,j,getVivaCelula(i,j)); //pintar una célula
			}
		}
	}
	
	var renderCelula = function (x,y,v){ //pinta en el contexto la célula indicada del tablero
		if(v==true){
			contexto.fillStyle="#00FF00"; //verde para las vivas
		}else{
			contexto.fillStyle="#000000"; //negro para las muertas
		}
		contexto.fillRect((tamanioCelula+1)*x,(tamanioCelula+1)*y,tamanioCelula,tamanioCelula); //pintamos en el canvas
	}
	
	this.turno = function(){ //ejecuta un turno en el tablero
		aumentarNumTurno(); //incrementa el número de turno
		evolucionar(); //evoluciona las células del tablero 
		render(); //pinta el tablero actualizado
	}
	
	this.renderCelulaOver = function (cordX,cordY){ //resalta en el contexto la célula sobre la que está el cursor	
		var xy= getXY(cordX,cordY); //pasamos las coordenadas de pixels a nº de célula
		var x= xy[0];
		var y= xy[1];
		var v=getVivaCelula(x,y);
		if(v==false){ 
			contexto.fillStyle= "#A4A4A4"; //gris claro para las muertas
			contexto.fillRect((tamanioCelula+1)*x,(tamanioCelula+1)*y,tamanioCelula,tamanioCelula); //pintamos en el canvas
		}else{
			contexto.fillStyle= "#00FF99"; //verde pálido para las vivas
			contexto.fillRect((tamanioCelula+1)*x,(tamanioCelula+1)*y,tamanioCelula,tamanioCelula); //pintamos en el canvas
		}
		if(!(x==lastX && y==lastY)) //si se ha cambiado de célula
			this.unRenderLastOver(); //desmarcamos la última célula sobre la que estaba el cursor
		
		//guardamos la posición y el estado de la última célula sobre la que ha estado el cursor
		lastX=x;
		lastY=y;
		lastV=v;
	}
	
	this.unRenderLastOver = function(){ //vuelve a pintar normal la célula que se ha resaltado
		setTimeout(renderCelula,200,lastX,lastY,lastV);
	}
			
	var getXY = function (cordX,cordY){ //pasa las coordenadas de pixels a nº de célula del tablero
		cordX-=contexto.canvas.offsetLeft+1; //restamos el margen izquierdo hasta el canvas
		cordY-=contexto.canvas.offsetTop+1; //restamos el margen superior hasta el canvas
		cordX=Math.floor(cordX/(tamanioCelula+1));
		cordY=Math.floor(cordY/(tamanioCelula+1));
		return [cordX,cordY];
		
	}
	
	this.toggleCelula = function (cordX,cordY){ //revive o mata la célula indicada según el caso
		var xy= getXY(cordX,cordY); //pasamos las coordenadas de pixels a nº de célula
		var x= xy[0];
		var y= xy[1];
		var v=!(getVivaCelula(x,y)); //invierte el estado de la célula 
		setCelula(x,y,new Celula(v)); //creamos una célula con el estado contrario
		renderCelula(x,y,v); //pintamos la célula en el contexto
		return v; //devolvemos el estado de la célula en boolean
	}
	
	this.getInfoCelula = function (cordX,cordY){ //devuelve información de la célula indicada
		var xy= getXY(cordX,cordY); //pasamos las coordenadas de pixels a número de célula
		var x= xy[0];
		var y= xy[1];
		return getCelula(x,y).toString(); //recuperamos la información de la célula en una cadena
	}
	
	//cambia la longitud del tablero en nºde células
	this.cambiarNumCelulas = function (operacion){
			if(operacion=='+'){ //más células
				if(numCelulas==5){ 
					this.init(10);
				}else if(numCelulas==10){
					this.init(50);
				}else{
					return false; //cuando se alcanza el tamaño máximo de células
				}
			}else{ //menos células
				if(numCelulas==50){
					this.init(10);
				}else if(numCelulas==10){
					this.init(5);
				}else{
					return false; //cuando se alcanza el tamaño mínimo de células
				}
			}
			return true; //cuando se realiza la acción correctamente
	}
	
}