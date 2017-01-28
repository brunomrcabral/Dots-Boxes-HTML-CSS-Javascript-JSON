var	clsStopwatch = function () {	//Stopwatch foi copiado e adaptado de um exemplo visto na internet
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
			return (new Date()).getTime();
		};

		// Public methods
		// Start or resume
		this.start = function() {
			startAt	= startAt ? startAt : now();
		};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
			lapTime = startAt = 0;
		};

		// Duration
		this.time = function() {
			return lapTime + (startAt ? now() - startAt : 0);
		};
	};


	function pad(num, size) {
		var s = "0000" + num;
		return s.substr(s.length - size);
	}

	function formatTime(time) {
		var h = m = s = ms = 0;
		var newTime = '';
	
		h = Math.floor( time / (60 * 60 * 1000) );
		time = time % (60 * 60 * 1000);
		m = Math.floor( time / (60 * 1000) );
		time = time % (60 * 1000);
		s = Math.floor( time / 1000 );
		ms = time % 1000;

		newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
		return newTime;
	}


//my time
var my_time;
var my_clocktimer;


function my_show() {
	my_time = document.getElementById('my_time');
	my_update();
}

function my_update() {
	my_time.innerHTML = formatTime(my_clock.time());
}

function my_start() {
	my_clocktimer = setInterval("my_update()", 1);
	my_clock.start();
}

function my_stop() {
	my_clock.stop();
	clearInterval(my_clocktimer);
}

function my_reset() {
	my_stop();
	my_clock.reset();
	my_update();
}

//opponents time

var opp_time;
var opp_clocktimer;


function opp_show() {
	opp_time = document.getElementById('opponents_time');
	opp_update(0);
}

function opp_update(x) {
	if ( x == 0 ) {
		opp_time.innerHTML = formatTime(opponents_clock.time());
	}
	else opp_time.innerHTML = formatTime(x);
}

function opp_start() {
	opp_clocktimer = setInterval("opp_update()", 1);
	opponents_clock.start();
}

function opp_stop() {
	opponents_clock.stop();
	clearInterval(opp_clocktimer);
}

function opp_reset() {
	opp_stop();
	opponents_clock.reset();
	opp_update();
}

//GLOBAL VARIABLES

var game_mode = "none";
var mod ; 
var logical_grid;
var aux;
var inner_divs;
var turn = "mine";
var playing = false;
var first_move_made = false;
var my_clock = new clsStopwatch();
var opponents_clock = new clsStopwatch();
var squares_taken_by_me = 0;
var squares_taken_by_opponent = 0;
var took_a_square = false;
var gave_up = false;

function Create2DArray(rows, columns) {
	var x = new Array(rows);
	for (var z = 0; z < rows; z++) {
		x[z] = [].repeat("empty", columns);
	}
	return x;
}

Array.prototype.repeat= function(what, L){
	while(L) this[--L]= what;
	return this;
}


// OTHER FUNCTIONS

function clean(){
	game_mode = "none";
	turn = "mine";
	playing = false;
	first_move_made = false;
	squares_taken_by_me = 0;
	squares_taken_by_opponent = 0;
	took_a_square = false;
	gave_up = false;
	document.getElementById("game_div").innerHTML = "";
	my_reset();
	opp_reset();
	document.getElementById("span_winner").innerHTML = "";
	document.getElementById("span_my_boxes").innerHTML = "0";
	document.getElementById("span_opponent_boxes").innerHTML = "0";
}

// MAKE A MOVE FUNCTIONS

function change_symbol_horz(d){
	var u ;
	var g ;
	if(playing==true){
		if(first_move_made==false) first_move_made=true;
		switch (game_mode) {
			case "beginner":
			document.getElementById(d.id).className = "horz_line_beginner";
			u = 5 ; 
			g = 7 ;
			break;
			case "intermediate":
			document.getElementById(d.id).className = "horz_line_intermediate";
			u = 9;
			g = 11;
			break;
			case "advanced":
			document.getElementById(d.id).className = "horz_line_advanced";
			u = 13;
			g = 17;
			break;
			case "expert":
			document.getElementById(d.id).className = "horz_line_expert";
			u = 19 ; 
			g = 23 ; 
			break;
			default:
		}
		for ( var i = 0; i < u ; i++) {
			for ( var j = 0 ; j < g ; j++){
				aux[i][j] = logical_grid[i][j];
			}
		}
		update_logical_grid(u,g);
		check_for_squares(u,g);
		check_for_win(u,g);
		end_turn(u,g);
		var k = 0 ; 
		var l = 0 ; 
		if ( mod == 1 ) {
			for ( var y = 0; y < u ; y++) {
				l = 0 ; 
				for ( var f = 1 ; f < g ; f++){
					if ( aux[y][f] != logical_grid[y][f]){
						notify("h",y+1-k,f-l);
					}
					f++;
					l++;
				}
				y++;
				k++;
			}
		}
	}
}


function change_symbol_vert(d){
	if(playing==true){
		if(first_move_made==false) first_move_made=true;
		switch (game_mode) {
			case "beginner":
			document.getElementById(d.id).className = "vert_line_beginner";
			u = 5 ; 
			g = 7 ;
			break;
			case "intermediate":
			document.getElementById(d.id).className = "vert_line_intermediate";
			u = 9;
			g = 11;
			break;
			case "advanced":
			document.getElementById(d.id).className = "vert_line_advanced";
			u = 13;
			g = 17;
			break;
			case "expert":
			document.getElementById(d.id).className = "vert_line_expert";
			u = 19 ; 
			g = 23 ; 
			break;
			default:
		}

		for ( var i = 0; i < u ; i++) {
			for ( var j = 0 ; j < g ; j++){
				aux[i][j] = logical_grid[i][j];
			}
		}

		update_logical_grid(u,g);
		check_for_squares(u,g);
		check_for_win(u,g);
		end_turn(u,g);
		var k = 0 ; 
		var l = 0 ; 
		if ( mod == 1 ) {
			for ( var y = 1; y < u ; y++) {
				l = 0 ; 
				for ( var f = 0 ; f < g ; f++){
					if ( aux[y][f] != logical_grid[y][f]){
						notify("v",y-k,f+1-l);
					}
					f++;
					l++;
				}
				y++;
				k++;
			}
		}
	}
}


function change_symbol_a(d){
	switch (game_mode) {
		case "beginner":
		document.getElementById(d.id).className = "a_beginner";
		break;
		case "intermediate":
		document.getElementById(d.id).className = "a_intermediate";
		break;
		case "advanced":
		document.getElementById(d.id).className = "a_advanced";
		break;
		case "expert":
		document.getElementById(d.id).className = "a_expert";
		break;
		default:
	}
}


function change_symbol_b(d){
	switch (game_mode) {
		case "beginner":
		document.getElementById(d.id).className = "b_beginner";
		break;
		case "intermediate":
		document.getElementById(d.id).className = "b_intermediate";
		break;
		case "advanced":
		document.getElementById(d.id).className = "b_advanced";
		break;
		case "expert":
		document.getElementById(d.id).className = "b_expert";
		break;
		default:
	}
}


function ai_make_move(rows3,columns3){
	if ( mod == 2 ) {
		var rows3;
		var columns3;
		var random_row = Math.floor( Math.random() * (rows3) );
		var random_column = Math.floor( Math.random() * (columns3) );
		var ai_found_move = false;

		if(logical_grid[random_row][random_column]=="empty"){
			if((random_row%2) == 0){
				change_symbol_horz(document.getElementById("game_div").childNodes[(random_row * columns3) + random_column]);
				ai_found_move = true;
			}
			else{
				change_symbol_vert(document.getElementById("game_div").childNodes[(random_row * columns3) + random_column]);
				ai_found_move = true;
			}
		}
		while( ai_found_move==false ){
			random_row = Math.floor( Math.random() * (rows3) );
			random_column = Math.floor( Math.random() * (columns3) );
			if(logical_grid[random_row][random_column]=="empty"){
				if((random_row%2) == 0){
					change_symbol_horz(document.getElementById("game_div").childNodes[(random_row * columns3) + random_column]);
					logical_grid[random_row][random_column]="vertical_line";
					ai_found_move = true;
				}
				else{
					change_symbol_vert(document.getElementById("game_div").childNodes[(random_row * columns3) + random_column]);
					logical_grid[random_row][random_column]="horizontal_line";
					ai_found_move = true;
				}
			}
		}
	}
}


// UPDATE LOGICAL GRID

function update_logical_grid(rowsu,columnsu){
	var childNodes = document.getElementById("game_div").childNodes;
	for(var iu=0; iu<rowsu; iu++){
		for(var ju=0; ju<columnsu; ju++){
			if( (childNodes[(iu*columnsu) + ju].className == "horz_line_beginner") || (childNodes[(iu*columnsu) + ju].className == "horz_line_intermediate") || (childNodes[(iu*columnsu) + ju].className == "horz_line_advanced") || (childNodes[(iu*columnsu) + ju].className == "horz_line_expert")){
				logical_grid[iu][ju]="horizontal_line";
			}
			else if( (childNodes[(iu*columnsu) + ju].className == "vert_line_beginner") || (childNodes[(iu*columnsu) + ju].className == "vert_line_intermediate") || (childNodes[(iu*columnsu) + ju].className == "vert_line_advanced") || (childNodes[(iu*columnsu) + ju].className == "vert_line_expert")){
				logical_grid[iu][ju]="vertical_line";
			}
		}
	}
}


//RUNFUNCTIONS

function start(q,x){
	clean();
	playing=true;
	mod = x ; 
	if ( q == 1 ) {
		game_mode = "beginner";
		grid(5,7,0,0,0);
	}
	else if ( q == 2 ) {
		game_mode = "intermediate";
		grid(9,11,35,0,0);
	}
	else if ( q == 3 ) {
		game_mode = "advanced";
		grid(13,17,35,99,0);
	}
	else {
		game_mode = "expert";
		grid(19,23,35,99,221);
	}
}
//MAKE FUNCTIONS

function grid(l,c,x,y,p){
	logical_grid = Create2DArray(l,c);
	aux= Create2DArray(l,c);
	inner_divs = [l*c];
	var symbol_div;
	var create_dot = true;
	var j=0;
	var row;
	var column;
	var a ;
	var b ; 
	if ( l == 5 ) {
		a = "dot_class_beginner";
		b = "inner_beginner";
	}
	else if ( l == 9 ) {
		a = "dot_class_intermediate";
		b = "inner_intermediate";
	}
	else if ( l == 13) {
		a = "dot_class_advanced";
		b = "inner_advanced";
	}
	else if ( l == 19) {
		a = "dot_class_expert";
		b = "inner_expert";
	}
	var visible_grid = document.getElementById("game_div");

	for(var i=0; i<(l*c); i++){
		row = Math.floor(i/c);
		column = i % c;
		inner_divs[i] = document.createElement("div");

		if((j%2)==0){ //even columns
			if(create_dot==true){ //even rows
				inner_divs[i].className = a;
				logical_grid[row][column]="dot";
			}
			else{ //odd rows
				inner_divs[i].className = b;
				inner_divs[i].addEventListener("click", function() {logical_grid[row][column]="vertical_line";change_symbol_vert(this);}, false);
			}
		}

		else{ //odd columns
			inner_divs[i].className = b;
			if(create_dot==true){ //even rows
				inner_divs[i].addEventListener("click", function() {logical_grid[row][column]="horizontal_line";change_symbol_horz(this);}, false);
			}
			else{ logical_grid[row][column]="potential_square"; } //odd rows
		}

		inner_divs[i].setAttribute("id", i+x+p+y);

		visible_grid.appendChild(inner_divs[i]);

		j++;
		if(j==c){
			j=0;
			create_dot = !create_dot;
		}

	}
}
// CHECK FOR SQUARES
function check_for_squares (rows1 , columns1) {
	for(var i1=0; i1<rows1; i1++){
		for(var j1=0; j1<columns1; j1++){
			if( (logical_grid[i1][j1]=="horizontal_line") && (i1<=(rows1-1-2)) ){ //found a horizontal_line
				if( (logical_grid[i1+1][j1-1]=="vertical_line") && (logical_grid[i1+1][j1+1]=="vertical_line") && (logical_grid[i1+2][j1]=="horizontal_line") ){
					if( logical_grid[i1+1][j1]=="potential_square" ){ //must create a new square
						logical_grid[i1+1][j1]="square";
						if(turn=="mine"){
							took_a_square = true;
							squares_taken_by_me = squares_taken_by_me + 1;
							document.getElementById("span_my_boxes").innerHTML = squares_taken_by_me;
							change_symbol_a(inner_divs[ ((i1+1)*columns1) + j1  ]);
						}
						else if(turn=="opponents"){
							took_a_square = true;
							squares_taken_by_opponent = squares_taken_by_opponent + 1;
							document.getElementById("span_opponent_boxes").innerHTML = squares_taken_by_opponent;
							change_symbol_b(inner_divs[ ((i1+1)*columns1) + j1  ]);
						}
					}
				}
			}
		}
	}
}


// CHECK FOR WIN
function check_for_win(rows2,columns2){
	var found_potential_square=false;
	for(var i2=0; i2<rows2; i2++){
		for(var j2=0; j2<columns2; j2++){
			if(logical_grid[i2][j2]=="potential_square"){
				found_potential_square = true;
			}
		}
	}

	if(found_potential_square==false){
		end_game(rows2);
	}
}




// UPDATE SCOREBOARD

function update_scoreboard(l){
	var target_scoreboard;
	var new_row;
	var new_tbody;
	var new_player_name;
	var new_player_score;
	var new_player_time;
	var children;
	var player_score;
	var player_time;
	var append_flag = false;
	var p ;
	if (l == 5 ) {
		p = "beginner_scoreboard";
	}
	else if ( l == 9 ) {
		p = "intermediate_scoreboard";
	}
	else if ( l == 13 ) {
		p = "advanced_scoreboard";
	}
	else if ( l == 19 ) {
		p = "expert_scoreboard";
	}
	target_scoreboard = document.getElementById(p);
	new_tbody = document.createElement("tbody");
	new_row = document.createElement("tr");

	new_player_name = document.createElement("td");
	new_player_score = document.createElement("td");
	new_player_time = document.createElement("td");

	new_player_name.innerHTML = document.getElementById("authentication_form").user.value;
	new_player_score.innerHTML = squares_taken_by_me;
	new_player_time.innerHTML = my_clock.time()/1000;

	new_row.appendChild(new_player_name);
	new_row.appendChild(new_player_score);
	new_row.appendChild(new_player_time);

	children = target_scoreboard.children;
	for (var is = 1; (is < children.length) && (append_flag==false); is++) {
		player_score = children[is].children[0].children[1].innerHTML;
		player_time = children[is].children[0].children[2].innerHTML;
				//alert(player_score);
				//alert(player_time);
				if(squares_taken_by_me > player_score){
					//alert("FOund one that is smaller!");
					//alert(children[is].innerHTML);
					new_tbody.appendChild(new_row);
					target_scoreboard.insertBefore(new_tbody, children[is]);
					append_flag = true;
				}
				else if(squares_taken_by_me == player_score){
					//alert("Found one just as big!");
					if(new_player_time.innerHTML <= player_time){
						new_tbody.appendChild(new_row);
						target_scoreboard.insertBefore(new_tbody, children[is]);
						append_flag = true;
					}
				}
			}
			new_tbody.appendChild(new_row);
			if(append_flag == false) target_scoreboard.appendChild(new_tbody);
			//alert(target_scoreboard.innerHTML);
		}



// END TURN
function end_turn(u,g,mod){
	if(playing == true){
		if(took_a_square == true && turn=="mine"){
			took_a_square = false;
		}
		else if(took_a_square == true && turn=="opponents"){
			took_a_square = false;
			setTimeout(ai_make_move(u,g), 1000);
		}
		else{
			if(turn=="opponents"){
				opponents_clock.stop();
				my_start();
				turn="mine";
			}
			else{
				my_stop();
				opponents_clock.start();
				turn = "opponents";
				setTimeout(ai_make_move(u,g), 1000);
				
			}
		}
	}
}

// END GAME
function end_game(l){
	my_stop();
	opp_stop();

	if(squares_taken_by_me>squares_taken_by_opponent && gave_up==false){
		update_scoreboard(l);
		alert("You Won!");
		document.getElementById("span_winner").innerHTML = "You!";
	}
	else if (squares_taken_by_me < squares_taken_by_opponent){
		alert("You Lost");
		document.getElementById("span_winner").innerHTML = "Your Opponent";
	}
	else{
		if(my_clock.time()<=opponents_clock.time() && gave_up==false){
			update_scoreboard(l);
			alert("You Won!");
			document.getElementById("span_winner").innerHTML = "You!";
		}
		else{
			alert("You Lost");
			document.getElementById("span_winner").innerHTML = "Your Opponent";
		}

	}
	game_mode = "none";
	turn = "mine";
	playing = false;
	first_move_made = false;
	squares_taken_by_me = 0;
	squares_taken_by_opponent = 0;
	took_a_square = false;
	gave_up = false;

}
//-------------------------------------------------
function init(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	function draw_circle (circleX, circleY, raio, cor) { 
    	//clear the canvas
    	context.clearRect(0,0,canvas.width, canvas.height);

    	context.beginPath();
    	var vel = 5;

    	if ( i > canvas.width+raio ) {
    		i = 0 ; 
    	}
    	else { i+=vel}
    		context.fillStyle = cor;
    	context.arc(circleX, circleY, raio, 0, Math.PI*2);
    	context.fill();
    }

    function draw_circle2 (circleX, circleY, raio, cor) { 
    	//clear the canvas
    	context.clearRect(400,400,canvas.width, canvas.height);
    	context.beginPath();
    	var vel = 5;

    	if ( j < 0 ) {
    		j=10*raio+385;
    	}
    	else j-=vel;
    	context.fillStyle = cor;
    	context.arc(circleX, circleY, raio, 0, Math.PI*2);
    	context.fill();
    }

    var i=0;
    var j = 985;
    setInterval(function(){draw_circle(i,100, 60 , "#8CC63F");draw_circle2(j,400,60,"#f5ec62")}, 22);
}


