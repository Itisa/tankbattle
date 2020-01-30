var url = 'ws://127.0.0.1:8888'

// var url = 'ws://192.168.1.100:8888'

var so = new WebSocket(url);
var mt;
var mdict;
var myuserid;
so.onmessage = function (event) {
	// console.log(event)
	var msg = JSON.parse(event.data);
	
	// console.log(msg,'down',msg.d2ata);
	
	if (msg.action=='connected') {
		ifconnected = true
		console.log('connected')
	}
	
	else if (msg.action=="talk_down") {
		talk.push([msg.data.text, msg.data.username, msg.data.team, 200])
	}

	else if (msg.action=='onlineuser'){
		wait()
		init()
		for (var i = 0; i < msg.data.length; i++) {
			var da = msg.data[i]
			p_all.push(da)
		}

	}
	else if (msg.action=='youruserid'){
		myuserid = msg.data.userid
		myusername = msg.data.username
	}

	else if (msg.action=='move_all') {
		p_all = msg.data[0]
		for (var i = 0; i < p_all.length; i++) {
			var pp = p_all[i]
			// console.log(pp,myuserid)
			if (pp.userid==myuserid) {
				myx = -pp.x+713;
				myy = -pp.y+340;
			}
		}
		// console.log(b_all[1][0])
		b_all = msg.data[1]
	}
	else if (msg.action=='all_lines') {
		all_lines = msg.data
	}
	else if (msg.action=='logerror') {
		if (msg.data == 'username has been used')
		alert('username has been used')
	}
	else if (msg.action=='map') {
		w_all = msg.data
	}
}




//////////////////////////////////////////////////////////////////////////////////////////
// 	else if (msg.action=='move_tank') {
// 		for (var i = 0; i < p_all.length; i++) {
// 			var pp = p_all[i];
			
// 			if (pp.userid==msg.data.userid) {
// 				p_all[i] = msg.data;
// 				break;			
// 			}
// 		}

// 	}

// //////////////////////////////////////////////////////////////////////////////////////////

// 	else if (msg.action=='onlineuse') {
// 		var postdict = pack('new_tank',mt);
// 		postdata(postdict);

// 		var ulist = JSON.parse(msg.userlist);
// 		for (var i = 0; i < ulist.length; i++) {
// 			var u = ulist[i];
// 			if (u[0]==thisuserid) {continue;}
// 			var newt = new Tank(u[0],0,0,0,0,0);
// 			// userid,username,x,y,facing,team		
// 			p_all.push(newt);
// 		}
// 	}
// 	// console.log('##########################')

// 	else if (msg.action=='exit') {
// 		for (var i = 0; i < p_all.length; i++) {

// 			var pp = p_all[i];
// 			if (pp.userid==msg.user) {
// 				p_all.splice(i,1);
// 				break;
// 			}
// 		}
// 	}

// 	else if (msg.action=='broad_msg_resp') {
// 		// console.log(msg,'msgina')
// 		var msga = {};
// 		if (msg.msg) {
// 			msga = JSON.parse(msg.msg);
// 			var da = msga.data;
// 		}

// 		// console.log(msga.cmd,'msgin')

// 		if (msga.cmd=='start') {
// 			init();
// 		}
// 		else if (msga.cmd=='new_kill') {
// 			//userid,x,y,facing,team
// 			var canvas = document.getElementById('main');
// 			var c = canvas.getContext("2d");
// 			c.font = "15px bold 黑体";
// 			c.fillText('username:'+username,10,20)
// 			c.fillText('userid:'+userid,10,40)
// 			c.stroke()
// 		}
// 		else if (msga.cmd=='new_tank') {

// 			var newp = new Tank(da.userid, da.username, da.x, da.y, da.facing, da.team)
// 			p_all.push(newp)

// 			console.log(p_all,'all tank')
// 			console.log(da.x,msga)
// 			if (!if_begin) {
// 				var postdict = pack('start');
// 				postdata(postdict);
// 				init();
// 			}
// 			//userid,username,x,y,facing,team
// 		}
// 		else if (msga.cmd=='move_tank') {
// 			//username,x,y,facing,health,bu_cd,team
// 			for (var i = 0; i < p_all.length; i++) {

// 				var pp = p_all[i]
// 				// console.log(p_all)
// 				// console.log(pp,da,'#################')
// 				if (pp.userid==da.userid) {
// 					// console.log(pp,da,'pp','da')
// 					pp.x = da.x;
// 					pp.y = da.y;
// 					pp.facing = da.facing;
// 					pp.sin = da.sin;
// 					pp.cos = da.cos;
// 					pp.gsin = da.gsin;
// 					pp.gcos = da.gcos;
// 					pp.health = da.health;
// 					pp.bu_cd = da.bu_cd;
// 					pp.team = da.team;
// 					break;
// 				}
// 			}
// 		}
// 		else if (msga.cmd=='new_bullet') {
// 			// console.log(da,'nb')
// 			var newb = new Bullet(da, da.x, da.y, da.gunfacing)
// 			b.push(newb)
// 			//firer,x,y,facing
// 		}
// 	}
//
//////////////////////////////////////////////////////////////////////////////////////////

function postdata(data) {
	if (if_begin||data.action=='login') {
		var t = JSON.stringify(data);
		// console.log(t,'up')
		so.send(t);
	}
}