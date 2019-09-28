var sett,f=0.25,size=1,speed=10
var jx=0,jy=0 //jia1 su4 du4
var if_w=0,if_s=0,if_a=0,if_d=0,if_f=0
var p = new Tank()
var p1 = new Tank()
map1 = [[1,100,100,10,200],[1,600,50,200,10]]

var p_all=[p,p1],b = []
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

function draw_tank(x,y,facing,health,bu_cd) {
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
	c.strokeStyle = "blue";
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
	c.strokeStyle = '#000';
	c.lineWidth = 5*size;
	c.stroke()

	c.translate(-x,-y);
}

function draw_bullet(x,y,sin,cos,lent) {
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.translate(x,y);
	c.beginPath();
	// c.moveTo((5*sin)*size,(-5*cos)*size);
	// c.lineTo((30*sin)*size,(-30*cos)*size);
	c.moveTo((-5*sin)*size,(5*cos)*size);
	c.lineTo((lent*sin)*size,(-lent*cos)*size);
	c.closePath();
	c.strokeStyle = '#ffff';
	c.lineWidth = 5*size;
	c.stroke();
	c.translate(-x,-y);
}
// function draw_wall() {
// 	var px=100,py=100,len=200;

// }

function time() {
	clean_board()
	draw_map()
	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]

		if (i==1){
			draw_tank(pp.x, pp.y, pp.facing, pp.health, pp.bu_cd);
			continue
		}

		if (pp.bu_cd>0) {pp.bu_cd-=1}
		// console.log(p_all,pp.x)
		if (if_f==1) {
			if (pp.bu_cd==0) {pp.fire();pp.bu_cd=10}
		}
		if (!(if_d&&if_a)) {
			if (if_d==1) {pp.facing+=5;pp.turn()}
			if (if_a==1) {pp.facing-=5;pp.turn()}
		}
		if (!(if_w&&if_s)) {
			// if (if_w) {pp.jx += 1*pp.sin;pp.jy -= 1*pp.cos}
			
			// console.log(pp.jx,pp.jy)
			if (if_w==1) {pp.x+=speed*pp.sin;pp.y-=speed*pp.cos}
			if (if_s==1) {pp.x-=speed*pp.sin;pp.y+=speed*pp.cos}
		}
		// pp.move();
		draw_tank(pp.x, pp.y, pp.facing, pp.health, pp.bu_cd)
	}

	for (var i = 0; i < b.length; i++) {
		var bb = b[i];
		if (bb.delete==false) {
			bb.move();
			draw_bullet(bb.x, bb.y, bb.sin, bb.cos, bb.lent)
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

