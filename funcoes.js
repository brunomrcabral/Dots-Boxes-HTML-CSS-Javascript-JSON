		var game_id = null;
		var game_key = null;
		var col = null;
		var row = null;
		var name ; 
		var yf ; 
		var ff;
		var pass ; 
		var orient;
		var level;
		var service = 'http://twserver.alunos.dcc.fc.up.pt:8000/';

	//*****************************************************************************	
	function register(form){
	var un = form.user.value;
	var pw = form.pass.value;

	var myobj = {
		name: un, 
		pass: pw
	};
	var params = JSON.stringify(myobj);
	var req = new XMLHttpRequest();
	req.open("POST",  service + "register", true);
	req.setRequestHeader("Content-type", "application/json");
	req.onload = function () { 
		if ( req.readyState == 4 && req.status == 200 ) {
			console.log("Resposta ---> " + req.responseText);
			if ( req.responseText == '{}') {

				document.getElementById("authentication_form").style.display="none";
				var user_text = document.createElement("span");
				user_text.innerHTML = "User: " + form.user.value;
				user_text.setAttribute("id", "usr_txt");
				document.getElementById("authentication").appendChild(user_text);

				var logout_button = document.createElement("button");
				logout_button.innerHTML = "Log Out";
				logout_button.style.float="right";
				logout_button.setAttribute("onclick", "logout(form)");
				logout_button.setAttribute("id", "logout_button");
				document.getElementById("authentication").appendChild(logout_button);
			}
			else alert(req.responseText); 	
		}
	}
	console.log(params);
	req.send(params);
	}
	//*****************************************************************************	
	function join(form){
	var un = document.forms["authentication_form"].user.value;
	var pw = document.forms["authentication_form"].pass.value;
	var lvl= form.level.value;
	var grp = form.group.value;
	var myobj = {
		name: un, 
		pass: pw, 
		level :lvl, 
		group: grp
	};
	var params = JSON.stringify(myobj);

	var req = new XMLHttpRequest();
	req.open("POST",  service + "join", true);
	req.setRequestHeader("Content-type", "application/json");

	req.onreadystatechange = function(){
		if ( req.readyState == 4 && req.status == 200 ) {
			var rsp = JSON.parse(req.responseText); 
			if(rsp.error == undefined ){
				game_id = rsp.game;
				game_key = rsp.key;			
				update();
				console.log("Resposta ---> " +req.responseText);
			}
			else{
				alert(rsp.error);
				return;	
			}
		}
	}
	console.log(params);
	req.send(params);
	}
	//*****************************************************************************	
	function leave(){
	if(game_id == null){
		return;
	}
	var un =document.forms["authentication_form"].user.value;
	var myobj = {
		name:un ,
		key: game_key,
		game: game_id
	};

	var params = JSON.stringify(myobj);
	var req = new XMLHttpRequest();
	req.open("post", service + "leave", true);
	req.setRequestHeader("Content-type", "application/json");
	req.onreadystatechange = function(){
		if ( req.readyState == 4 && req.status == 200 ) {
			var rsp = JSON.parse(req.responseText); 
			if(rsp.error !== undefined){
				alert("Ocorreu um erro a fechar o lobby (" + rsp.error + ")");
				return;
			}
			if (rsp.error == undefined ){
				alert("Fechou");
				console.log("Resposta --> " + rsp.responseText);
				game_id = game_key = null;
			}
		}
	}
	console.log(params);
	req.send(params);
	}
	//*****************************************************************************	
	function notify(or,linha, coluna) {
	var un = document.forms["authentication_form"].user.value;

	var myobj = {
		name: un,
		game: game_id,
		key: game_key,
		orient : or,
		row: linha,
		col: coluna
	};
	var params = JSON.stringify(myobj);
	var req = new XMLHttpRequest();
	req.open("POST", service + "notify", true);
	req.setRequestHeader("Content-type", "application/json");
	req.onreadystatechange = function(){
		if ( req.readyState == 4 && req.status == 200 ) {
			var rsp = JSON.parse(req.responseText); 
			if(rsp.error != undefined){
				alert("Erro: " + rsp.error);
				return;
			}
			else {
				update();
			}
			
		}
		
	}
	console.log("Resposta ---> " +req.responseText);
	console.log(params);

	req.send(params);
	}
	//*****************************************************************************	
	function update(){
	game_vs = game_turn = null;
	var un = document.forms["authentication_form"].user.value;
	var lvl = document.forms["fm2"].level.value;
	var x ; 
	var s = 0;
	if (lvl=="beginner"){
		x = 1; 
		u = 5;
		g = 7;
	}
	else if (lvl =="intermediate"){
		x = 2 ; 
		u = 9;
		g = 11;
	}
	else if (lvl =="advanced"){
		x = 3 ; 
		u = 13;
		g = 17;	
	}
	else if (lvl =="expert"){
		x = 4 ; 
		u = 19 ; 
		g = 23 ;
	}

	sse = new EventSource(service+ 'update?name=' + un + '&game=' + game_id + '&key=' + game_key);
	sse.onmessage = function(event){

		rsp = JSON.parse(event.data);
		console.log("Resposta ---> " + JSON.stringify(rsp,null,2));

		if(rsp.error != undefined){
			alert("Erro: " + rsp.error);
			game_id = game_key = null;
			event.target.close();
			return;	
		}
		if ( rsp.turn == un) {
			alert("E a sua vez");
		}
		else alert("Aguarde pela jogada do adversario.");

		if(game_vs == null || game_turn == null){
			game_vs = rsp.opponent;
			game_turn = rsp.turn;
			s++;
		}
		if ( game_vs != null && game_turn != null && s == 1  ) {
			start(x,1);
		}

		/***********************/
		if (rsp.turn != rsp.move.name) {
			//console.log ( rsp.move.name +" "+  rsp.move.orient + " "+ rsp.move.row +  " "+ rsp.move.col);
			var tms = rsp.move.time*1000; 
			opp_update(tms);
			if ( rsp.move.row == 1 && rsp.move.orient=="h" ) {
				rowd = 0 ; 
			}
			if ( rsp.move.row == 1 && rsp.move.orient=="v" ) {
				rowd = 1 ; 
			}
			else{ if ( rsp.move.orient =="h") { 
				rowd = rsp.move.row + (rsp.move.row-2);
			}
			else { rowd = rsp.move.row + (rsp.move.row - 1);

			}
		}

			if ( rsp.move.col == 1 && rsp.move.orient=="h" ) {
				cold =1 ; 
			}
			if ( rsp.move.col == 1 && rsp.move.orient=="v" ) {
				cold = 0 ; 
			}
			else{ if ( rsp.move.orient =="h") { 
				cold = rsp.move.col + (rsp.move.col-1);
			}
			else { cold = rsp.move.col + (rsp.move.col - 2);
			}
		}
				//console.log(rowd + " /////" + cold);

			if ( rsp.move.orient == "h"){
				if ( rowd == 0 ) {
					change_symbol_horz(document.getElementById("game_div").childNodes[rowd+cold]);				
				}
				else {
					change_symbol_horz(document.getElementById("game_div").childNodes[rowd*(g-1)+cold+rowd]);	
				}
				logical_grid[rowd][cold]="horizontal_line";
			}
			if ( rsp.move.orient == "v"){
				if ( cold == 0 ) {
					change_symbol_vert(document.getElementById("game_div").childNodes[rowd*(g-1)+rowd]);
				}
				else {
					change_symbol_vert(document.getElementById("game_div").childNodes[rowd*(g-1)+cold+rowd]);
				}

				logical_grid[rowd][cold]="vertical_line";
			}
		}

		if(rsp.winner != undefined){
			if(rsp.winner == session_username && rsp.winner == un){
				alert("Ganhou");			
			}
			else{
				alert("Perdeu");
			}	
			game_id = game_key = null;
			event.target.close();
			return;
		}
	};
	}


	//*****************************************************************************	
	function ranking(form) {
	var lvl= form.level.value;
	var tam ; 
	var myobj = {
		level: lvl
	};
	if ( lvl =="beginner") {
		var table = document.getElementById("beg");
		beg_online.style.display="";
	}
	else if ( lvl =="intermediate") {
		var table = document.getElementById("int");
		int_online.style.display="";

	}
	else if ( lvl =="advanced"){
		var table = document.getElementById("adv");
		adv_online.style.display="";

	}
	else if ( lvl =="expert") {
		var table = document.getElementById("exp");
		exp_online.style.display="";

	}

	var params = JSON.stringify(myobj);

	var req = new XMLHttpRequest();
	req.open("POST",  service + "ranking", true);
	req.setRequestHeader("Content-type", "application/json");

	req.onreadystatechange = function () { 
		if ( req.readyState == 4 && req.status == 200 ) {
			var rsp = JSON.parse(req.responseText); 
			console.log("Resposta ---> " + (req.responseText)); 
			for ( var h = 0 ; h < rsp.ranking.length;h++){
				var counter = rsp.ranking[h];
				n = counter.name;
				b = counter.boxes;
				t = counter.time;

				var row = table.insertRow(-1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);

				cell1.innerHTML=n;
				cell2.innerHTML=b;
				cell3.innerHTML=t;
			}
		}
	}
	console.log(params);
	req.send(params);
	}

	//*****************************************************************************
	function logout(form) {
	document.getElementById("authentication_form").style.display = "";
	document.getElementById("authentication").removeChild(document.getElementById("usr_txt"));
	document.getElementById("authentication").removeChild(document.getElementById("logout_button"));
	}