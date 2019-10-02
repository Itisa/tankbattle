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
	this.delete = false;
	this.team = team;
}

var psm = Tank.prototype;

psm.hitted = function(firer) {
	this.health -= 1
	console.log(this.health)
	if (this.health==0){
		// var postdict=pack('this_die',this)
		// postdata(postdict)
		// this.delete = true;
		this.health = 10

		text.push([firer.username,firer.team,this.username,this.team,100])
		// console.log(text)
	}
}

psm.move = function() {
	var j = this.jx/this.sin;

	if (this.sin==0) {var j=0}
	console.log(j,this.jx,this.jy)
	if (j<0){this.jx -= f*this.sin;this.jy -= f*this.cos}
	
	console.log(j,this.jx,this.jy,1)

	if (j>5) {this.jx=5*this.sin; this.jy=5*this.cos};
	if (j<-5) {this.jx=-5*this.sin; this.jy=-5*this.cos};	
	if (Math.abs(this.jx)<=f*this.sin) {jx=0};
	if (Math.abs(this.jy)<=f*this.cos) {jy=0};
	this.x += this.jx*2;
	this.y += this.jy*2;
}

psm.fire = function() {
	var bu = new Bullet(this, this.x, this.y, this.facing);
	// var postdict = {'cmd':'broadmsg','msg':['new_bullet',bu.firer]};
	// var postdict = {},act={};
	// postdict['cmd'] = 'broadmsg';
	// act['new_bullet'] = bu.firer;
	// var ss = JSON.stringify(act);
	// postdict['action'] = ss;
	var postdict = pack('new_bullet',bu.firer)
	postdata(postdict);

	b.push(bu);
}
psm.turn = function() {
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
}


var p = new Tank()



