function Tank(userid,username,x,y,facing,team) {
	//username,x,y,facing,team
	this.userid = userid;
	this.username = username;
	this.x = x;
	this.y = y;
	this.facing = facing;
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
	
	this.jx = 0;
	this.jy = 0;
	this.f = 0.25
	this.bullets = 0;
	this.health = 10;
	this.bu_cd = 0;
	this.dead = false;
	this.team = team;
	this.gunfacing = facing;
	this.gsin = this.sin;
	this.gcos = this.cos;
	// var sin=this.sin, cos=this.cos;
	// this.ltx = (-20*cos+25*sin);
	// this.lty = (-20*sin-25*cos);
	// this.lbx = (-20*cos-25*sin);
	// this.lby = (-20*sin+25*cos);
	// this.rbx = (20*cos-25*sin);
	// this.rby = (20*sin+25*cos);
	// this.rtx = (20*cos+25*sin);
	// this.rty = (20*sin-25*cos);
}

var psm = Tank.prototype;

psm.hitted = function(firer) {
	this.health -= 1
	console.log(this.health)
	if (this.health==0){
		// var postdict=pack('this_die',this)
		// postdata(postdict)
		// this.dead = true;
		this.health = 10

		text.push([firer.username,firer.team,this.username,this.team,100])
		// console.log(text)
	}
}

psm.move = function() {
	var j = this.jx/this.sin;

	if (this.sin==0) {var j=0}
	console.log(j,this.jx,this.jy)
	if (j<0){
		this.jx -= f*this.sin;
		this.jy -= f*this.cos;
	}
	
	console.log(j,this.jx,this.jy,1)

	if (j>5) {
		this.jx=5*this.sin;
		this.jy=5*this.cos;
	}
	if (j<-5) {
		this.jx=-5*this.sin;
		this.jy=-5*this.cos;
	}
	if (Math.abs(this.jx)<=f*this.sin) {jx=0};
	if (Math.abs(this.jy)<=f*this.cos) {jy=0};
	this.x += this.jx*2;
	this.y += this.jy*2;
}

psm.fire = function() {
	var bu = new Bullet(this, this.x, this.y, this.gunfacing);

	var postdict = pack('new_bullet',bu.firer)
	postdata(postdict);

	b.push(bu);
}
psm.turn = function(degree) {

	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
}

psm.ifmove = function(cmd,da) {
	// var sin = this.sin, cos = this.cos;
	if (cmd=='turn'){
		var iffacing = this.facing+da, ifgunfacing = this.gunfacing+da;
		var ifsin = Math.sin(iffacing*Math.PI/180);
		var ifcos = Math.cos(iffacing*Math.PI/180);
		var ifx = this.x, ify = this.y;			
	}
	else if(cmd=='move'){
		var ifx = this.x+da*this.sin;
		var ify = this.y-da*this.cos;
		var ifsin = this.sin, ifcos = this.cos, iffacing = this.facing;
	}

	var ltx = Math.round(-20*ifcos+25*ifsin);
	var lty = Math.round(-20*ifsin-25*ifcos);
	var lbx = Math.round(-20*ifcos-25*ifsin);
	var lby = Math.round(-20*ifsin+25*ifcos);
	var rbx = Math.round(20*ifcos-25*ifsin);
	var rby = Math.round(20*ifsin+25*ifcos);
	var rtx = Math.round(20*ifcos+25*ifsin);
	var rty = Math.round(20*ifsin-25*ifcos);
	// console.log(ltx,lty,lbx,lby,rbx,rby,rtx,rty,ifx,ify)

	for (var i = 0; i < map1.length; i++) {
		var m = map1[i];
		// console.log(m[1]+m[3],m[1],'wallx')
		// console.log(m[2]+m[4],m[2],'wally')
		if (m[1]+m[3]>(ifx+ltx)&&m[1]<(ifx+ltx)) {
			if (m[2]+m[4]>(ify+lty)&&m[2]<(ify+lty)) {
				return 0;
			}
		}
		if (m[1]+m[3]>(ifx+lbx)&&m[1]<(ifx+lbx)) {
			if (m[2]+m[4]>(ify+lby)&&m[2]<(ify+lby)) {
				return 0;
			}
		}
		if (m[1]+m[3]>(ifx+rbx)&&m[1]<(ifx+rbx)) {
			if (m[2]+m[4]>(ify+rby)&&m[2]<(ify+rby)) {
				return 0;
			}
		}
		if (m[1]+m[3]>(ifx+rtx)&&m[1]<(ifx+rtx)) {
			if (m[2]+m[4]>(ify+rty)&&m[2]<(ify+rty)) {
				return 0;
			}
		}
		// if ((ifx+ltx)>m[1]&&m[1]+m[3]<(ifx+rbx)) {
		// 	if (m[2]>ify+) {}
		// }
		if (ifx>m[1]&&m[1]+m[3]>ifx) {
			if (ify+lty>m[2]&&m[2]+m[4]>ify+lty) {
				return 0
			}
		}
		if (ifx>m[1]&&m[1]+m[3]>ifx) {
			if (ify+lby>m[2]&&m[2]+m[4]>ify+lby) {
				return 0
			}
		}
		if (ifx>m[1]&&m[1]+m[3]>ifx) {
			if (ify+rty>m[2]&&m[2]+m[4]>ify+rty) {
				return 0
			}
		}
		if (ifx>m[1]&&m[1]+m[3]>ifx) {
			if (ify+rby>m[2]&&m[2]+m[4]>ify+rby) {
				return 0
			}
		}
	}

	this.x = ifx;
	this.y = ify;
	this.facing = iffacing;
	this.sin = ifsin;
	this.cos = ifcos;
	if (cmd=='turn') {
		this.gunfacing += da;
		this.gsin = Math.sin(this.gunfacing*Math.PI/180);
		this.gcos = Math.cos(this.gunfacing*Math.PI/180);
	}
}

psm.turngun = function(degree){
	this.gunfacing = this.gunfacing+degree;
	this.gsin = Math.sin(this.gunfacing*Math.PI/180);
	this.gcos = Math.cos(this.gunfacing*Math.PI/180);
}


var p = new Tank()



