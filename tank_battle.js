var sett,f=0.25,size=1,speed=10
var jx=0,jy=0 //jia1 su4 du4
var if_w=0,if_s=0,if_a=0,if_d=0,if_f=0
//userid,username,x,y,facing,team
var p = new Tank(1,'321',200,100,130,'red')
var p1 = new Tank(2,'2345',1200,200,0,'blue')
map1 = [[1,100,100,10,200],[1,600,50,200,10],[1,300,300,10,200],[1,450,200,10,200]]
var bx = new Bullet(0,0,0,0,0,true)
var p_all=[p,p1],b = [bx]
var text = [['hello','blue','hi','red',100]];
//x,y,facing,jx,jy

var canvas = document.getElementById('main');
var c = canvas.getContext("2d");

adjustCanvas(canvas,c)

function clean_board() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	c.clearRect(0,0,1425,1000)
}


function init() {
	sett = setInterval(time,50)
}

function draw_map() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	c.fillStyle = 'black'
	for (var i = 0; i < map1.length; i++) {
		var wall = map1[i];
		// c.beginPath();
		if (wall[0]==1) {
			c.fillRect(wall[1],wall[2],wall[3],wall[4]);
			c.stroke();
		}
		if (wall[0]==2) {
			c.beginPath();
			c.moveTo(wall[0])
		}
	}
}

function draw_tank(x,y,facing,health,bu_cd,team) {
	// console.log('draw',x,y,facing)
	c.beginPath();
	var sin = Math.sin(facing*Math.PI/180);
	var cos = Math.cos(facing*Math.PI/180);

	c.translate(x,y);

	//body
	c.moveTo((-20*cos+25*sin)*size,(-20*sin-25*cos)*size);
	c.lineTo((-20*cos-25*sin)*size,(-20*sin+25*cos)*size);
	c.lineTo((20*cos-25*sin)*size,(20*sin+25*cos)*size);
	c.lineTo((20*cos+25*sin)*size,(20*sin-25*cos)*size);
	c.closePath();
	c.lineWidth = 5*size;
	c.strokeStyle = team;
	c.stroke();
	// c.fillRect(-10,-15,20,20)
	
	//drive box
	c.beginPath();
	c.moveTo((-10*cos+15*sin)*size,(-10*sin-15*cos)*size);
	c.lineTo((-10*cos-5*sin)*size,(-10*sin+5*cos)*size);
	c.lineTo((10*cos-5*sin)*size,(10*sin+5*cos)*size);
	c.lineTo((10*cos+15*sin)*size,(10*sin-15*cos)*size);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2*size;
	c.stroke();
	
	//gun
	c.beginPath();
	// c.moveTo(0*cos+5*sin,0*sin-5*cos)
	// c.lineTo(0*cos+30*sin,0*sin-30*cos)
	c.moveTo((5*sin)*size,(-5*cos)*size);
	c.lineTo((30*sin)*size,(-30*cos)*size);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2*size;
	c.stroke();

	//health bar
	c.beginPath();
	var hea = health*3-15
	c.moveTo((-15*cos-10*sin)*size,(-15*sin+10*cos)*size);
	c.lineTo((hea*cos-10*sin)*size,(hea*sin+10*cos)*size);
	c.closePath();
	c.strokeStyle = 'red';
	c.lineWidth = 5*size;
	c.stroke()

	//gun_cd bar
	c.beginPath();
	var cd_b = bu_cd*(-3)+15
	c.moveTo((-15*cos-18*sin)*size,(-15*sin+18*cos)*size);
	c.lineTo((cd_b*cos-18*sin)*size,(cd_b*sin+18*cos)*size);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 5*size;
	c.stroke()

	c.translate(-x,-y);
}

function draw_bullet(x,y,sin,cos,lent,team) {
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.translate(x,y);
	c.beginPath();
	// c.moveTo((5*sin)*size,(-5*cos)*size);
	// c.lineTo((30*sin)*size,(-30*cos)*size);
	// c.moveTo((-5*sin)*size,(5*cos)*size);
	// c.lineTo((lent*sin)*size,(-lent*cos)*size);
	c.moveTo(0,0);
	c.lineTo((-lent*sin)*size,(lent*cos)*size);
	// c.closePath();
	c.strokeStyle = team;
	c.lineWidth = 5*size;
	c.stroke();
	c.translate(-x,-y);
}

function draw_text() {
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.font = "20px bold 黑体";
	c.fillStyle = "#ff0";
	
	// c.textBaseline = "left";
	for (var i = 0; i < text.length; i++) {
		text[i][4] -= 1;
		if (text[i][4]==0) {
			text.splice(i,1);
			continue;
		}
		var tt = text[i];
		// var x = 1425-(tt[0].length+tt[2].length+10)*10;
		// console.log(tt[0].length,tt[2].length)
		// console.log(tt,x)
		c.textAlign = "right";
		c.fillStyle = tt[1];
		c.fillText(tt[0],1290,200+20*i);
		// x += (tt[0].length+2)*10
		c.textAlign = "left";
		c.fillStyle = 'black';
		c.fillText('kills',1300,200+20*i)
		// x += (tt[2].length+2)*10
		c.textAlign = "left";
		c.fillStyle = tt[3];
		c.fillText(tt[2],1350,200+20*i);
		// c.fillText(text[i][0],text[i][1],text[i][2]);

	}
}

function time() {

	clean_board()

	draw_map()
	draw_text()
	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]

		if (pp.delete==true) {continue;}
		if (i==1){
			draw_tank(pp.x, pp.y, pp.facing, pp.health, pp.bu_cd, pp.team);
			continue
		}


		if (pp.bu_cd>0) {pp.bu_cd-=1}
		// console.log(p_all,pp.x)
		if (if_f==1) {
			if (pp.bu_cd==0) {pp.fire();pp.bu_cd=0}
		}
		if (!(if_d&&if_a)) {
			if (if_d==1) {pp.facing+=10;pp.turn()}
			if (if_a==1) {pp.facing-=10;pp.turn()}
			// if (if_d==1) {
			// 	if (if_s==1){pp.facing-=10;}
			// 	else {pp.facing+=10;}
			// 	pp.turn();
			// 	}
			// if (if_a==1) {
			// 	if (if_s==1){pp.facing+=10;}
			// 	else {pp.facing-=10;}
			// 	pp.turn();
			// }
		}
		if (!(if_w&&if_s)) {
			// if (if_w) {pp.jx += 1*pp.sin;pp.jy -= 1*pp.cos}
			
			// console.log(pp.jx,pp.jy)
			if (if_w==1) {pp.x+=speed*pp.sin;pp.y-=speed*pp.cos}
			if (if_s==1) {pp.x-=speed*pp.sin;pp.y+=speed*pp.cos}
		}
		// pp.move();
		draw_tank(pp.x, pp.y, pp.facing, pp.health, pp.bu_cd, pp.team)
	}

	for (var i = b.length - 1; i >= 0; i--) {
		var bb = b[i];
		if (bb.delete==false) {
			bb.move();
			draw_bullet(bb.x, bb.y, bb.sin, bb.cos, bb.lent, bb.team);
		}else{
			b.splice(i,1)
		}
	}

}

function presskey(ev) {
	var c = ev.keyCode//,speed=2;
	// console.log(ev,'down')
	switch(c){
	case 38:
	case 87://w
		if_w = 1
		break;
	case 83://s
	case 40:
		if_s = 1 
		break;
	case 39:
	case 68://d
		if_d = 1
		break;
	case 37:
	case 65://a
		if_a = 1
		break;
	case 70:
	case 13:
		if_f = 1
		// all_bullets.push([100,100,0,1])
		break;
	}
	// all_bullets.push([all_tanks[0][0],all_tanks[0][1],sin,cos]);
}
function keyup(ev) {
	var c = ev.keyCode
	// console.log(ev);
	switch(c){
	case 38:
	case 87://w
		if_w = 0
		break;
	case 83://s
	case 40:
		if_s = 0
		break;
	case 39:
	case 68://d
		if_d = 0
		break;
	case 37:
	case 65://a

		if_a = 0
		break;
	case 70:
	case 13:
		if_f = 0
		break;
	}
}


function getPixelRatio(context) {
// 获取 canvas 的 backingStorePixelRatio 值
var backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
// 若 devicePixelRatio 不存在，默认为 1
return (window.devicePixelRatio || 1) / backingStore;
}

function adjustCanvas(canvas, context) {
    var ratio = getPixelRatio(context);
    // 获取 canvas 的原始大小
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    // 按照比例放大 canvas
    console.log(oldHeight,oldWidth)
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    // 用 css 将 canvas 再调整成原来大小
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    // 按照比率把 context 再缩放回来
    context.scale(ratio, ratio);
}


init()
