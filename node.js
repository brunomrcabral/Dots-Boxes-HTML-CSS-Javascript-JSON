var mysql = require('mysql');
var http = require('http');
var url = require('url');
var Chance = require('chance');
var chance = new Chance();
var crypto = require('crypto');
var formidable = require('formidable');
var util = require('util');

var struture = [];
var conn;
function DB() {
	conn = mysql.createConnection({
			host : 'localhost', // Parâmetros da conexão a BD
			user : 'up201202369',
			password : '',
			database : 'up201202369'
			});

	conn.connect(function(err) {	
		if(err) { // Servidor em baixo ou inacessível
			console.log(new Date().toUTCString()+"  :  "+'error when connecting to DataBase: ', err);
			setTimeout(DB, 2000); // Volta a tentar mais tarde
		}
		else{
			console.log(new Date().toUTCString()+"  :  "+"Connected to DataBase BD");
		}
	});
	conn.on('error', function(err) {
		console.log(new Date().toUTCString()+"  :  "+'DataBase error: ', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') { // por timeout
			DB();
		} else {
			throw err;
		}
	});
}

DB();			//chama a funcao para a BD 

var server = http.createServer(function (req, res) {
	
	
	var request = url.parse(req.url,true);
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Max-Age', '86400');
	res.setHeader("Content-Type", "application/json;charset=UTF-8");
	
//------------------------Register-----------------------------------------	
	if(request.pathname=="/register"){
		console.log("Received: ");
		console.log("	register");
		var form = new formidable.IncomingForm(),
			fields = [];
		form
			.on('error', function(err) {
				res.writeHead(200, {'content-type': 'application/json'});
				res.end('error:\n\n'+util.inspect(err));
			})
			.on('field', function(field, value) {
				console.log("	"+field, value);
				fields.push([field, value]);
			})
			.on('end', function() {
				authentication(fields[0][1],fields[1][1], res);
			});
		form.parse(req); 
	}
//------------------------Ranking-----------------------------------------
	else if(request.pathname=="/ranking"){
		console.log("Received: ");	
		console.log("	ranking");
		var form = new formidable.IncomingForm(),
			fields = [];
		form
			.on('error', function(err) {
				res.writeHead(200, {'content-type': 'application/json'});
				res.end('error:\n\n'+util.inspect(err));
			})
			.on('field', function(field, value) {
				console.log("	"+field, value);
				fields.push([field, value]);
			})
			.on('end', function() {
				if(fields.length!=0){
					writeRanks(fields[0][1],res);
				}
				else{
					console.log(new Date().toUTCString()+"  :  "+"Pedio errado");
					res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin' : '*'});
					res.end();
				}
			});
		form.parse(req); 
	}
//------------------------Join-----------------------------------------
	else if(request.pathname=="/join"){
		console.log("Received: ");
		console.log("	join");
		var aceite = true;
		var form = new formidable.IncomingForm(),
			fields = [];
		form
			.on('error', function(err) {
				res.writeHead(200, {'content-type': 'application/json'});
				res.end('error:\n\n'+util.inspect(err));
			})
			.on('field', function(field, value) {
				console.log("	"+field, value);
				fields.push([field, value]);
			})
			.on('end', function() {
				if(fields[2][1]== "beginner" || fields[2][1] == "expert" || fields[2][1] == "advanced" || fields[2][1] == "intermediate"){
					makeJoin(fields[0][1],fields[1][1],fields[2][1],fields[3][1], res);
				}
				else{
					console.log(new Date().toUTCString()+"  :  "+"Dimensoes do Jogo Erradas");
					res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin' : '*'});
					res.end();
				}
			});
		form.parse(req); 
	}

});
server.listen(8029);
console.log(new Date().toUTCString()+"  :  "+"Listening on server twserver.alunos.dcc.fc.up.pt:8029");
console.log(new Date().toUTCString()+"  :  "+"Listening on port 8029");

//------------------------Register---------------------------------
function authentication(name, pass, res){
	var bool = false;
	var jsonResult = {};
	var pattern=/\W/;
	if(!pattern.test(name)){		//nome aceite pelo servidor		
		conn.query("SELECT name, pass, salt FROM Users WHERE name=?", name, function(err,rows,fields){//Placeholders
			if(err){
				console.log(new Date().toUTCString()+"  :  "+"ERRO de pesquisa");
				res.end();
			}
			else{
				if(rows.length==0){
					console.log(new Date().toUTCString()+"  :  "+"Sem resultados");

						var sal = chance.string({length:4, alpha: true});
						var password = crypto.createHash('md5').update(pass.concat(sal)).digest('hex');
						
						conn.query('INSERT INTO Users SET name=?, pass=?, salt=?', [ name, password, sal ], function(err, result) {//Placeholders
							if (err) {
								conn.rollback(function() { throw err; });
							}
								console.log(new Date().toUTCString()+"  :  "+'Utilizador inserido');
							
						});
					bool=true;
					console.log(new Date().toUTCString()+"  :  "+"Tentativa com sucesso para o utilizador: " + name);
					res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
						'Access-Control-Allow-Origin' : '*'}
					);
					res.end(JSON.stringify(jsonResult));
				}
				else{
					//verificar se as credenciais do utilizador estao de acordo com a BD
					for(var i=0; i<rows.length;i++){
						var password = crypto.createHash('md5').update(pass.concat(rows[i].salt)).digest('hex');
						
						
						if(rows[i].pass==password){
							
							bool = true;
							console.log(new Date().toUTCString()+"  :  "+"Tentativa com sucesso para o utilizador: "+name);
							res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
								'Access-Control-Allow-Origin' : '*'}
							);
							res.end(JSON.stringify(jsonResult));
						}
					}
					if(!bool){
						jsonResult.error = 'User registered with a different password';
						console.log(new Date().toUTCString()+"  :  "+"Tentativa falhada para o utilizador: "+name);
						res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
							'Access-Control-Allow-Origin' : '*'}
						);
						res.end(JSON.stringify(jsonResult));
					}
					
				}	
			}	
		});
	}
	else{
		console.log(new Date().toUTCString()+"  :  "+"Nome contém caracteres não suportados para username");
		res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8', 
			'Access-Control-Allow-Origin' : '*'}
		);
		res.end();
	}	
}
//------------------------Ranking----------------------------------
function writeRanks(level,res){
	conn.query('SELECT * FROM Rankings WHERE level=? ORDER BY boxes DESC, time ASC LIMIT 10',level, function(err, rows, fields){
		if(err){
			console.log(new Date().toUTCString()+"  :  "+"Erro de pesquisa");
			res.end();
		}
		else{
			
			var ranking = [];
			for(var i = 0; i<rows.length; i++){
				//console.log(rows[i].name);
				var entry = {'name' : rows[i].name ,'boxes': rows[i].boxes ,'time': rows[i].time};
				ranking.push(entry);
	
			}

			var myJSON = JSON.stringify({ranking : ranking});
			console.log(new Date().toUTCString()+"  :  "+myJSON);
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
				'Access-Control-Allow-Origin' : '*'}
			);
			res.end(myJSON);
		}
	});
}

function makeJoin(name, pass, level, group, res){

	conn.query('SELECT * FROM Users WHERE name=?',name, function (err,rows,fields){//Placeholders
			if(err){
				console.log(new Date().toUTCString()+"  :  "+"Erro de pesquisa");
				res.end();
			}
			else{
				if (rows.length==0){
					console.log(new Date().toUTCString()+"  :  "+"Nao existe esse utilizador");
					res.end();
				}
				else{
					var password = crypto.createHash('md5').update(pass.concat(rows[0].salt)).digest('hex');
					//console.log(password);
					//console.log(rows[0].pass);
					if(password == rows[0].pass){
						if(struture.length==0){	// 1 Sessao
							var key = crypto.createHash('md5').update(chance.string()).digest('hex');
							var game = struture.length;
							
							var insertStruture = {'game': game, 'key': [key], 'level' : level, 'players': [name] , 'group': [group]};
						
							struture.push(insertStruture);
							console.log(new Date().toUTCString()+"  :  " +name+ " criou um jogo");
							
							var myJSON = {};
							myJSON.game=game;
							myJSON.key=key;
							
							var jsonResult = JSON.stringify(myJSON);
							res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
								'Access-Control-Allow-Origin' : '*'}
							);
							res.end(jsonResult);
						}
						else{
							var find = false;
							for (var i=0; i<struture.length; i++){ // Ve todos os disponiveis e compara a entrada no group
						
									if(struture[i].players.length==1 && group == struture[i].group && level == struture[i].level){
										var key = crypto.createHash('md5').update(chance.string()).digest('hex');
										struture[i].key.push(key);
										struture[i].players.push(name);
										
										console.log(new Date().toUTCString()+"  :  "+name+" juntou-se a um jogo");
										find = true;
										
										var myJSON = {};
										myJSON.game=struture[i].game;
										myJSON.key=struture[i].key[1];
										
										var jsonResult = JSON.stringify(myJSON);
										res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
											'Access-Control-Allow-Origin' : '*'}
										);
										res.end(jsonResult);
										
									}
								}
							if(!find){ // Se nao encontrou nenhum com o mesmo grupo cria um novo 
									var key = crypto.createHash('md5').update(chance.string()).digest('hex');
									var game = struture.length+1;
									
									var insertStruture = {'game': game, 'key': [key], 'level' : level, 'players': [name], 'group': [group]};
								
									struture.push(insertStruture);
									console.log(new Date().toUTCString()+"  :  "+name+ " criou um jogo");
									
									var myJSON = {};
									myJSON.game=game;
									myJSON.key=key;
									
									var jsonResult = JSON.stringify(myJSON);
									
									res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 
										'Access-Control-Allow-Origin' : '*'}
									);
									res.end(jsonResult);
							}
						}
					}
					else{
						authentication(name,pass,res);		
					}
				}
			}	
		});
}
