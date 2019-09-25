function Tank() {
	this.x = 600;
	this.y = 200;
	this.facing = 0;
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
	this.jx = 0;
	this.jy = 0;
	this.bullets = 0;
	this.health = 10;
}


var psm = Tank.prototype;

psm.hitted = function() {
	this.health -= 1	
}

psm.move = function() {
	var j = this.jx/this.sin;
	if (j>5) {this.jx=5*this.sin;jy=5*this.cos};
	if (j<-5) {this.jx=-5*this.sin;jy=-5*this.cos};
	
	// jx = jx*(j/j+f)
	// jy = jy*(j/j+f)
	// if (jx>0) {jx -= f*sin};
	// if (jx<0) {jx += f*sin};
	// if (jy>0) {jy -= f*cos};
	// if (jy<0) {jy += f*cos};
	if (Math.abs(this.jx)<=f*this.sin) {jx=0};
	if (Math.abs(this.jy)<=f*this.cos) {jy=0};
	this.x += jx*2;
	this.y += jy*2;
}

psm.fire = function() {
	all_bullets.push([this.x,this.y,this.sin,this.cos]);
}
psm.turn = function() {
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
}


var p = new Tank()



