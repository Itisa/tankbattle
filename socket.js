var url = '#############'

var so = new WebSocket(url);
var mt
so.onmessage = function (event) {
	var msg = JSON.parse(event.data);

	// console.log(msg,'down');
	
	if (msg.action=='connected') {
		var	x = Math.floor(Math.random()*1400);
		var y = Math.floor(Math.random()*300);
		if (thisuserid%2==1) {var team='red'}
		else {var team='blue'}

		mt = new Tank(thisuserid,'test',x,y,0,team)
		p_all.push(mt)
		console.log(mt,'mt')

		postdata(mdict)


		var postdict = pack('new_tank',mt);
		postdata(postdict);
		// postdata()
	}
	
	if (msg.action=='onlineuser') {
		var ulist = JSON.parse(msg.userlist);
		for (var i = 0; i < ulist.length; i++) {
			var u = ulist[i];
			if (u[0]==thisuserid) {continue;}
			var newt = new Tank(u[0],0,0,0,0,0)
			// userid,username,x,y,facing,team		
			p_all.push(newt)
		}
	}
	// console.log('##########################')

	if (msg.action=='exit') {
		for (var i = 0; i < p_all.length; i++) {

			var pp = p_all[i];
			if (pp.userid==msg.user) {
				p_all.splice(i,1)
				break;
			}
		}
	}

	if (msg.action=='broad_msg_resp') {
		// console.log(msg,'msgina')
		if (msg.msg) {
			var msga = JSON.parse(msg.msg);
			var da = msga.data
		}else {var msga={};}

		console.log(msga.cmd,'msgin')

		if (msga.cmd=='start') {
			init();
		}
		if (msga.cmd=='new_kill') {
			//userid,x,y,facing,team
			var canvas = document.getElementById('main');
			var c = canvas.getContext("2d");
			c.font = "15px bold 黑体";
			c.fillText('username:'+username,10,20)
			c.fillText('userid:'+userid,10,40)
			c.stroke()
		}
		if (msga.cmd=='new_tank') {

			var newp = new Tank(da.userid, da.username, da.x, da.y, da.facing, da.team)
			p_all.push(newp)

			console.log(p_all,'all tank')
			console.log(da.x,msga)
			//userid,username,x,y,facing,team
		}
		if (msga.cmd=='move_tank') {
			//username,x,y,facing,health,bu_cd,team
			for (var i = 0; i < p_all.length; i++) {

				var pp = p_all[i]
				// console.log(p_all)
				// console.log(pp,da,'#################')
				if (pp.userid==da.userid) {
					// console.log(pp,da,'pp','da')
					pp.x = da.x;
					pp.y = da.y;
					pp.facing = da.facing;
					pp.health = da.health;
					pp.bu_cd = da.bu_cd;
					pp.team = da.team;
					break;
				}
			}
		}
		if (msga.cmd=='new_bullet') {
			// console.log(da,'nb')
			var newb = new Bullet(da, da.x, da.y, da.facing)
			b.push(newb)
			//firer,x,y,facing
		}
	}
}


function postdata(data) {

	var t = JSON.stringify(data);
	// console.log(t,'up')
	so.send(t);
}