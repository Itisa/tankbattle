function Bullet(firer,x,y,facing,stop=false) {
	this.firer = firer;
	this.team = firer.team;
	this.speed = 35;

	this.facing = facing;
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
	this.x = x+55*this.sin*size;
	this.y = y-55*this.cos*size;
	this.lent = 30;
	this.dead = false;
	this.stop = stop;
}

var psm = Bullet.prototype

psm.move = function() {
	// console.log(this.sin,this.cos,this.facing)
	if (this.stop==false) {
		this.x += this.speed*this.sin;
		this.y -= this.speed*this.cos;
		// this.speed -= 0.5
		if (this.speed<=0) {this.dead=true}
		var x=this.x, y = this.y;
		if (x>1400) {this.dead=true}
		else if (x<0) {this.dead=true}
		if (y>700) {this.dead=true}
		else if (y<0) {this.dead=true}
		// console.log(this)
		this.if_impact()
	}
}
psm.if_impact = function() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");


	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]
		if (pp == this.firer) {continue}
		var x=pp.x, y=pp.y, tx=this.x, ty=this.y;
		// c.fillRect(this.x-10,this.y-10,20,20);

		if (tx-(x+25)<0&&tx-(x-25)>0) {
			if (ty-15<y+20&&ty+15>y-20) {
			// c.fillRect(this.x-5,this.y-5,10,10);
			if (pp.team==this.team) {continue;}
			if (pp.dead==false) {pp.hitted(this.firer);this.dead = true;}
			
			// this.stop=true;
			}
			
		}
	}
	
	// for (var i = 0; i < map1.length; i++) {
		// map1[i]
	
	// }
	
}




