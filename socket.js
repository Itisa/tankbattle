var so = new WebSocket(url);
so.onmessage = function (event) {
	var msg = JSON.parse(event.data);
	console.log(msg);
	if (msg[0]==1) {
		var newp = new Tank(msg[1],msg[2],msg[3],msg[4],msg[5],msg[6])
		p.push(newp)
		//userid,username,x,y,facing,team
	}
	if (msg[0]==2) {
		//username,x,y,facing,health,bu_cd,team
		for (var i = 0; i < p.length; i++) {

			var pp = p[i]
			if (pp.userid==msg[i]) {
				pp.x = x;
				pp.y = y;
				pp.facing = facing;
				pp.health = health;
				pp.bu_cd = bu_cd;
				break;

			}
		}
	}
}


function postdata(data) {
	var t = JSON.stringify(data);
	so.send(t);
}