
function getInput(l1,l2) { //Inicialização
	m = l1 ; 
	n = l2 ; 
	for (var i=0;i<=m;i++) {
		ponta_X[i]=[];
		for (var j=0;j<n;j++) ponta_X[i][j]=0;
	}
	for (i=0;i<m;i++) {
		ponta_Y[i]=[];
		for (j=0;j<=n;j++) ponta_Y[i][j]=0;
	}
	for (i=0;i<m;i++) {
		quadr[i]=[];
		for (j=0;j<n;j++) quadr[i][j]=0;
	}
	nn=2*n+1;
	set(m,n);

}

function set(m,n){
document.write('<link rel="stylesheet" type="text/css" href="pagina_entrada_stylesheet.css"> ');
document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">');
document.write('<title>Dots and Boxes</title>')
document.write('<table bgcolor=#bfbfbf border="0" cellpadding="0" cellspacing="0" align=center><tr>')
for (i=0;i<m;i++) {
	for (j=0;j<n;j++) { // Definicao das celulas Horizontais
		document.write('<td align=center> <img src="preto.gif" border=0 width=8 height=8></td>');
		
		document.write('<td align=center><a href="javascript:move_x('+i+','+j+')"'
		+' onMouseover="javascript:if (ponta_X['+i+']['+j+']<1) document.horiz'+i+j+'.src=n2.src"'
		+' onMouseout="javascript:if (ponta_X['+i+']['+j+']<1) document.horiz'+i+j+'.src=n3.src">'
		+'<img src="branco.gif" name="horiz'+i+j+'" border=0 width=36 height=8></a></td>');
	}
	document.write('<td align=center><img src="preto.gif" width=8 height=8></td></tr><tr>');

	for (j=0;j<n;j++) { // Definicao de celulas verticais 
		document.write('<td align=center><a href="javascript:move_y('+i+','+j+')"'
		+' onMouseover="javascript:if (ponta_Y['+i+']['+j+']<1) document.vertic'+i+j+'.src=n2.src"'
		+' onMouseout="javascript:if (ponta_Y['+i+']['+j+']<1) document.vertic'+i+j+'.src=n3.src">'
		+'<img src="branco.gif" name="vertic'+i+j+'" border=0 width=8 height=36></a></td>');
		document.write('<td align=center><img name="'+i+j
		+'" src="verde.gif" border=0 width=36 height=36></td>');
	}	
	// 	Colocar em posicao vertical
		document.write('<td align=center><a href="javascript:move_y('+i+','+j+')"' 
		+' onMouseover="javascript:if (ponta_Y['+i+']['+j+']<1) document.vertic'+i+j+'.src=n2.src"'
		+' onMouseout="javascript:if (ponta_Y['+i+']['+j+']<1) document.vertic'+i+j+'.src=n3.src">'
		+'<img src="branco.gif" name="vertic'+i+j+'" border=0 width=8 height=36></a></td></tr>');
		
}

for (j=0;j<n;j++) {  // Ultima linha
	document.write('<td align=center><img src="preto.gif" border=0 width=8 height=8></td>');
		document.write('<td align=center><a href="javascript:move_x('+i+','+j+')"'
		+' onMouseover="javascript:if (ponta_X['+i+']['+j+']<1) document.horiz'+i+j+'.src=n2.src"'
		+' onMouseout="javascript:if (ponta_X['+i+']['+j+']<1) document.horiz'+i+j+'.src=n3.src">'
		+'<img src="branco.gif" name="horiz'+i+j+'" border=0 width=36 height=8></a></td>');
}
document.write('<td align=center><img src="preto.gif" border=0 width=8 height=8></td></tr>'); // Ultimo ponto 
document.write('</table>');
document.write('<button id="reset" onclick="location.reload(true);">Novo Jogo</button>');
}

function setponta_X(x,y) {      //Marca X escolhido
	ponta_X[x][y]=1;
	if (x>0) quadr[x-1][y]++;
	if (x<m) quadr[x][y]++;
	document.images[2*x*nn+2*y+1].src=n2.src;
	ver_x(x,y)
	jog=1-jog;
}

function setponta_Y(x,y) {      //Marca Y escolhido
 	ponta_Y[x][y]=1;
	if (y>0) quadr[x][y-1]++;
	if (y<n) quadr[x][y]++;
	document.images[(2*x+1)*nn+2*y].src=n2.src;
	ver_y(x,y)
	jog=1-jog;
}

