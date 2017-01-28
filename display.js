
function show_game(){
	game_div.style.display="";
	scoreboard.style.display="none";
	dif_Online.style.display="none";
	beg_online.style.display="none";
	int_online.style.display="none";
	adv_online.style.display="none";
	exp_online.style.display="none";
	menu_nav.style.display="";
}

function show_rank(){
	beg_online.style.display="none";
	int_online.style.display="none";
	adv_online.style.display="none";
	exp_online.style.display="none";
	menu_nav.style.display="";
	if(document.getElementById("scoreboard").style.display=="none"){
		document.getElementById("scoreboard").style.display="";
		document.getElementById("game_div").style.display="none";
		document.getElementById("dif_Online").style.display="none";

	}
	else {
		document.getElementById("scoreboard").style.display="none";
		document.getElementById("game_div").style.display="";
	}

}
function show_rank_online(){
	game_div.style.display="none";
	
	scoreboard.style.display="none";
	dif_Online.style.display="";
	menu_nav.style.display="none";
	beg_online.style.display="none";
	int_online.style.display="none";
	adv_online.style.display="none";
	exp_online.style.display="none";
	menu_nav.style.display="none";
}
function show_dif_Online(){
	game_div.style.display="";
	scoreboard.style.display="none";
	dif_Online.style.display="";
	menu_nav.style.display="none";
	beg_online.style.display="none";
	int_online.style.display="none";
	adv_online.style.display="none";
	exp_online.style.display="none";
	menu_nav.style.display="none";
	
}




