/*----------------------------------Declaraçoes-----------------------------------------------------------------*/
var n0 = new Image();
var n1 = new Image();
var n2 = new Image();
var n3 = new Image();

n0.src = "amarelo.gif";
n1.src = "azul.gif";
n2.src = "preto.gif";
n3.src = "branco.gif";

var flag = [n0.src,n1.src];
var jog=1;
var timer = 0; 
var pontuacao=[0,0];
var ponta_X=[];
var ponta_Y=[];
var quadr=[];
var nn,x,y,zz,cont,loop,u,v,l1,l2,m,n,minutes,second;

/*----------------------------------------------Adversario--------------------------------------------------------------*/
function move_x(i,j) {     //Jogada X
	if (ponta_X[i][j]<1) {
		setponta_X(i,j);
		if (pontuacao[0]+pontuacao[1]==m*n) {
			alert("Fim\r Pontuacao: Computador = "+pontuacao[0]+",  Jogador = "+pontuacao[1]+"\rTempo de Jogo: "+ minutes + ":"+ seconds);
			//location.reload(true);
		} else if (jog==0) jogada();
	}
}

function move_y(i,j) {     //Jogada Y 
	if (ponta_Y[i][j]<1) {
		setponta_Y(i,j);
		if (pontuacao[0]+pontuacao[1]==m*n) {
			alert("Fim\r Pontuacao: Computador = "+pontuacao[0]+",  Jogador = "+pontuacao[1]+"\rTempo de Jogo: "+ minutes + ":"+ seconds);
			//location.reload(true);
		} else if (jog==0) jogada();
	}
}

function quadrado(i,j) { 	// Escolher a que acaba num quadrado
	if (ponta_X[i][j]<1) setponta_X(i,j);
	else if (ponta_Y[i][j]<1) setponta_Y(i,j);
	else if (ponta_X[i+1][j]<1) setponta_X(i+1,j);
	else setponta_Y(i,j+1);
}

function jogada() {
	caixas_de3();
	if (caixas_de3()) {
		if (melhor()) {
			caixas_de3_todas();
			takeedge(zz,x,y);
		} else {
			escolha(u,v)
			}
		if (pontuacao[0]+pontuacao[1]==m*n) {
			alert("Fim\r Pontuacao: Computador = "+pontuacao[0]+",  Jogador = "+pontuacao[1]+"\rTempo de Jogo: "+ minutes + ":"+ seconds);
			//location.reload(true);
		}
	} else if (melhor()) takeedge(zz,x,y);
	else if (uma_caixa()) takeedge(zz,x,y);
	else qualquer();
}

//--------------------------------Jogadas normais/aleatorias--------------------------------------------------------------------

function rand_ponta_X(i,j) { // Aleatorio X
	x=i;
	y=j;
	do {
		if (seg_ponta_X(x,y)) return true;
		else {
			y++;
			if (y==n) {
				y=0;
				x++;
				if (x>m) x=0;
			}
		}
	} while (x!=i || y!=j);
	return false
}

function rand_ponta_Y(i,j) { // Aleatorio Y
	x=i;
	y=j;
	do {
		if (seg_ponta_Y(x,y)) return true;
		else {
			y++;
			if (y>n) {
				y=0;
				x++;
				if (x==m) x=0;
			}
		}
	} while (x!=i || y!=j);
	return false
}

function takeedge(zz,x,y) {    //Escolha aleatoria.
	if (zz>1) setponta_Y(x,y);
	else setponta_X(x,y);
}

function qualquer() { // Prioridade nas pontas_X  > pontas_Y > qualquer
	x=-1;
	for (i=0;i<=m;i++) {
		for (j=0;j<n;j++) {
			if (ponta_X[i][j]<1) {
				x=i;
				y=j;
				i=m+1;
				j=n
			}
		}
	}
	if (x<0) {
		for (i=0;i<m;i++) {
			for (j=0;j<=n;j++) {
				if (ponta_Y[i][j]<1) {
					x=i;
					y=j;
					i=m;
					j=n+1;
				}
			}
		}
		setponta_Y(x,y);
	} else {
		setponta_X(x,y);
	}
	if (jog==0) jogada();
}

//-----------------------------------------------------Jogadas Inteligentes---------------------------------------------
function melhor() {     //Escolhe a melhor jogada X ou Y 
	if (Math.random()<.5) zz=1; else zz=2;  
	var i=Math.floor(m*Math.random());
	var j=Math.floor(n*Math.random());
	if (zz==1) {
		if (rand_ponta_X(i,j)) return true;
		else {
			zz=2;
			if (rand_ponta_Y(i,j)) return true;
		}
	} else {
		if (rand_ponta_Y(i,j)) return true;
		else {
			zz=1;
			if (rand_ponta_X(i,j)) return true;
		}
	}
	return false;
}

function seg_ponta_X(i,j) {     //Avalia o X
	if (ponta_X[i][j]<1) {
		if (i==0) {
			if (quadr[i][j]<2) return true
		} else if (i==m) {
			if (quadr[i-1][j]<2) return true
		}
		else if (quadr[i][j]<2 && quadr[i-1][j]<2) return true;
	}
	return false
}

function seg_ponta_Y(i,j) {		//Avalia o Y
	if (ponta_Y[i][j]<1) {
		if (j==0) {
			if (quadr[i][j]<2) return true
		} else if (j==n) {
			if (quadr[i][j-1]<2) return true
		}
		else if (quadr[i][j]<2 && quadr[i][j-1]<2) return true;
	}
	return false
}

function caixas_de3() {     //Se existir uma "caixa com 3 lados completos" ve se ao conquistar essa caixa o jogador nao fica a ganhar no jogo geral
	for (var i=0;i<m;i++) {
		for (var j=0;j<n;j++) {
			if (quadr[i][j]==3) {
				if (ponta_Y[i][j]<1) {
					if (j==0 || quadr[i][j-1]!=2) setponta_Y(i,j);
				} else if (ponta_X[i][j]<1) {
					if (i==0 || quadr[i-1][j]!=2) setponta_X(i,j);
				} else if (ponta_Y[i][j+1]<1) {
					if (j==n-1 || quadr[i][j+1]!=2) setponta_Y(i,j+1);
				} else {
					if (i==m-1 || quadr[i+1][j]!=2) setponta_X(i+1,j);
				}
			}
		}
	}
}

function caixas_de3() {    //Procura caixas de 3
	for (var i=0;i<m;i++) {
		for (var j=0;j<n;j++) {
			if (quadr[i][j]==3) {
				u=i;
				v=j;
				return true;
			}
		}
	}
	return false;
}

function caixas_de3_todas() {  // Numa so jogada com mais de 1 caixa de 3 escolhe sempre TODAS as opçoes de 3 
	while (caixas_de3()) quadrado(u,v);
}
function caixas_de3_nunca(x,y) {
	for (var i=0;i<m;i++) {
		for (var j=0;j<n;j++) {
			if (quadr[i][j]==3) {
				if (i!=x || j!=y) {
					u=i;
					v=j;
					return true;
				}
			}
		}
	}
	return false
}

//-------------------------------------------------------------------------------------------------------------
function uma_caixa() {     //Returns true and zz,x,y if edge(x,y) gives exactly
	var k;              
	for (var i=0;i<m;i++) {
		for (var j=0;j<n;j++) {
			if (quadr[i][j]==2) {
				k=0;
				if (ponta_X[i][j]<1) {
					if (i<1 || quadr[i-1][j]<2) k++;
				}
				zz=2;
				if (ponta_Y[i][j]<1) {
					if (j<1 || quadr[i][j-1]<2) k++;
					if (k>1) {
						x=i;
						y=j;
						return true;
					}
				}
				if (ponta_Y[i][j+1]<1) {
					if (j+1==n || quadr[i][j+1]<2) k++;
					if (k>1) {
						x=i;
						y=j+1;
						return true;
					}
				}
				zz=1;
				if (ponta_X[i+1][j]<1) {
					if (i+1==m || quadr[i+1][j]<2) k++;
					if (k>1) {
						x=i+1;
						y=j;
						return true;
					}
				}
			}
		}
	}
	return false;
}

function escolha(i,j) {     //"Sacrificar um se existe alguma caixa de 3 que podemos conquistar"
    cont=0;
	loop=false;
	incont(0,i,j);
	if (!loop) ponta_off_limits(i,j);
	if (cont+pontuacao[0]+pontuacao[1]==m*n) {
		caixas_de3_todas()
	} else {
		if (loop) {
			cont=cont-2;
		}
		outcont(0,i,j);
		i=m;
		j=n
	}
}

function incont(k,i,j) {  
    cont++;              
	if (k!=1 && ponta_Y[i][j]<1) {     
		if (j>0) {
			if (quadr[i][j-1]>2) {
				cont++;
				loop=true;
			} else if (quadr[i][j-1]>1) incont(3,i,j-1);
		}
	} else if (k!=2 && ponta_X[i][j]<1) {
		if (i>0) {
			if (quadr[i-1][j]>2) {
				cont++;
				loop=true
			} else if (quadr[i-1][j]>1) incont(4,i-1,j);
		}
	} else if (k!=3 && ponta_Y[i][j+1]<1) {
		if (j<n-1) {
			if (quadr[i][j+1]>2) {
				cont++;
				loop=true
			} else if (quadr[i][j+1]>1) incont(1,i,j+1);
		}
	} else if (k!=4 && ponta_X[i+1][j]<1) {
		if (i<m-1) {
			if (quadr[i+1][j]>2) {
				cont++;
				loop=true
			} else if (quadr[i+1][j]>1) incont(2,i+1,j);
		}
	}
}

function outcont(k,i,j) {     
	if (cont>0) {
		if (k!=1 && ponta_Y[i][j]<1) {
			if (cont!=2) setponta_Y(i,j);
			cont--;
			outcont(3,i,j-1)
		} else if (k!=2 && ponta_X[i][j]<1) {
			if (cont!=2) setponta_X(i,j);
			cont--;
			outcont(4,i-1,j)
		} else if (k!=3 && ponta_Y[i][j+1]<1) {
			if (cont!=2) setponta_Y(i,j+1);
			cont--;
			outcont(1,i,j+1)
		} else if (k!=4 && ponta_X[i+1][j]<1) {
			if (cont!=2) setponta_X(i+1,j);
			cont--;
			outcont(2,i+1,j)
		}
	}
}
	
function caixas_de3_perigo(x,y) { // Nao escolhe uma determinada caixa de 3 se essa escolha ajudar o Jogador
	for (var i=0;i<m;i++) {
		for (var j=0;j<n;j++) {
			if (quadr[i][j]==3) {
				if (i!=x || j!=y) {
					u=i;
					v=j;
					return true;
				}
			}
		}
	}
	return false
}

function ponta_off_limits(x,y) { // Nunca escolhe esta
	while (caixas_de3_nunca(x,y)) {
		quadrado(u,v);
	}
}

//--------------------------------------Funçoes de controlo -------------------------------------------
function ver_x(x,y) {     //Ver se jogada X ajuda o jog a ganhar
	var hit=0;
	if (x>0) {
		if (quadr[x-1][y]==4) {
			var uu=x-1;
			document.images[(2*uu+1)*nn+2*y+1].src=flag[jog];
			pontuacao[jog]++;
			hit=1;
		}
	}
	if (x<m) {
		if (quadr[x][y]==4) {
			document.images[(2*x+1)*nn+2*y+1].src=flag[jog];
			pontuacao[jog]++;
			hit=1;
		}
	}
	if (hit>0) jog=1-jog;
}

function ver_y(x,y) {		//Ver se jogada Y ajuda o jog a ganhar
	var hit=0;
	if (y>0) {
		if (quadr[x][y-1]==4) {
			var vv=y-1;
			document.images[(2*x+1)*nn+2*vv+1].src=flag[jog];
			pontuacao[jog]++;
			hit=1;
		}
	}
	if (y<n) {
		if (quadr[x][y]==4) {
			document.images[(2*x+1)*nn+2*y+1].src=flag[jog];
			pontuacao[jog]++;
			hit=1;
		}
	}
	if (hit>0) jog=1-jog;
}

 function startTimer(duration) {	//Clock
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

       //alert(minutes + ":" + seconds);

        if (++timer < 0) {
            timer = duration;
        }
    }, 1000);
}