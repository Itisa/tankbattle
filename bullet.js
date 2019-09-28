function Bullet(x,y,facing,firer) {
	this.firer = firer
	this.speed = 40
	this.x = x;
	this.y = y;
	this.facing = facing;
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
	this.lent = 30;
	this.delete = false;
	this.stop = false;
}

var psm = Bullet.prototype

psm.move = function() {
	// console.log(this.sin,this.cos,this.facing)
	if (this.stop==true) {return 0}
	this.x += this.speed*this.sin;
	this.y -= this.speed*this.cos;
	this.speed -= 0.5
	if (this.speed<=0) {this.delete=true}
	var x=this.x, y = this.y;
	if (x>1300) {this.delete=true}
	if (x<100) {this.delete=true}
	if (y>600) {this.delete=true}
	if (y<100) {this.delete=true}
	// console.log(this)
	this.if_impact()
}
psm.if_impact = function() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");


	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]
		if (pp == this.firer) {continue}
		var x=pp.x, y=pp.y, tx=this.x, ty=this.y;



		if (tx-(x+25)<0&&tx-(x-25)>0) {
			if (ty-15<y+25&&ty+15>y-25) {
			c.fillRect(this.x-5,this.y-5,10,10);
			pp.hitted();
			this.stop=true;
			}
			
		}
	}
	//for
	for (var i = 0; i < map1.length; i++) {
		map1[i]
	
	}
	
}




