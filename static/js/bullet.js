function Bullet(firer,x,y,facing,stop=false) {
	this.firer = firer;
	this.team = firer.team;
	this.speed = 20;

	this.facing = facing;
	this.sin = Math.sin(this.facing*Math.PI/180);
	this.cos = Math.cos(this.facing*Math.PI/180);
	this.x = x+30*this.sin*size;
	this.y = y-30*this.cos*size;
	this.lent = 30;
	this.dead = false;
	this.stop = stop;
}

var psm = Bullet.prototype

psm.move = function() {
	// console.log(this.sin,this.cos,this.facing)
	if (this.stop==false) {
		this.if_impact()
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
	}
}
psm.if_impact = function() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	var tx=this.x, ty=this.y;
	// c.fillRect(this.x-10,this.y-10,20,20);

	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]
		if (pp == this.firer) {continue}
		var x=pp.x, y=pp.y;
		

		if (tx-(x+25)<0&&tx-(x-25)>0) {
			if (ty-15<y+20&&ty+15>y-20) {
			// c.fillRect(this.x-5,this.y-5,10,10);
			if (pp.team==this.team) {continue;}
			if (pp.dead==false) {pp.hitted(this.firer);this.dead = true;}
			
			// this.stop=true;
			}
			
		}
	}
	var botx = tx-this.lent*this.sin;
	var	boty = ty+this.lent*this.cos;
	var midx = tx-(this.lent*this.sin)/2;
	var midy = ty+(this.lent*this.cos)/2;
	// c.fillRect(botx-5,boty-5,10,10);
	// c.fillRect(midx-5,midy-5,10,10);
	for (var i = 0; i < map1.length; i++) {
		var m = map1[i];
		// console.log(tx,ty,botx,boty,midx,midy);
		// console.log(m[1],m[2],m[1]+m[3],m[2]+m[4]);
		if (m[1]+m[3]>tx&&m[1]<tx) {
			if (m[2]+m[4]>ty&&m[2]<ty) {
				
				this.dead=true;
			}
		}

		if (botx<m[1]&&tx>m[1]+m[3]){
			if (boty<m[2]&&ty>m[2]+m[4]) {
				this.dead=true;
			}
		}
		if (botx>m[1]+m[3]&&tx<m[1]){
			if (boty<m[2]+m[4]&&ty>m[2]) {
				this.dead=true;
			}
		}
		// if (botx>m[1]&&tx<m[1]){
			// if (boty<m[2]+m[4]&&ty>m[2]) {
				// this.stop=true;
			// }
		// }
		// console.log('middle');
		if (midx>m[1]&&midx<m[3]) {
			if (midy>m[2]&&midy<m[4]) {

				this.dead=true;
			}
		}
		
	}

	
}




