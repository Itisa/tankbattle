var sett,x=200,y=200,bx,by,i=0,facing=0,f=0.25,speed=10
var jx=0,jy=0 //jia1 su4 du4
var all_tanks = [[1000,600,0,0,0]], all_bullets=[]
var if_w=0,if_s=0,if_a=0,if_d=0,if_f=0
var p = new Tank()
var p_all=[p]
//x,y,facing,jx,jy

var canvas = document.getElementById('main');
var c = canvas.getContext("2d");
adjustCanvas(canvas,c)

function clean_board() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	c.clearRect(0,0,1425,1000)
}
// function draw_all() {	
// 	for (var i = all_tanks.length-1; i >= 0; i--) {
// 		// console.log(tan)
// 		// draw_tank()
// 	}
// 	for (var i = all_bullets.length - 1; i >= 0; i--) {
// 		var bul = all_bullets[i]
// 		draw_bullet(bul[0],bul[1],bul[2],bul[3])
// 	}

// }


function init() {
	sett = setInterval(time,50)
}
function draw_tank(x,y,facing) {
	// console.log('draw',x,y,facing)
	c.beginPath();
	// var cos = 1
	var sin = Math.sin(facing*Math.PI/180);
	var cos = Math.cos(facing*Math.PI/180);
	// var sin = Math.sin(facing*Math.PI/180)
	// var cos = Math.cos(facing*Math.PI/180)
	c.translate(x,y);

	c.moveTo(-20*cos+25*sin,-20*sin-25*cos);
	c.lineTo(-20*cos-25*sin,-20*sin+25*cos);
	c.lineTo(20*cos-25*sin,20*sin+25*cos);
	c.lineTo(20*cos+25*sin,20*sin-25*cos);

	c.closePath();
	c.lineWidth = 5;
	c.strokeStyle = "red";
	c.stroke();
	// c.fillRect(-10,-15,20,20)
		
	c.beginPath();
	c.moveTo(-10*cos+15*sin,-10*sin-15*cos);
	c.lineTo(-10*cos-5*sin,-10*sin+5*cos);
	c.lineTo(10*cos-5*sin,10*sin+5*cos);
	c.lineTo(10*cos+15*sin,10*sin-15*cos);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2;
	c.stroke();
	
	c.beginPath();
	// c.moveTo(0*cos+5*sin,0*sin-5*cos)
	// c.lineTo(0*cos+30*sin,0*sin-30*cos)
	c.moveTo(5*sin,-5*cos);
	c.lineTo(30*sin,-30*cos);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2;
	c.stroke();
	c.translate(-x,-y);
}

function draw_bullet(x,y,sin,cos) {
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.translate(x,y);
	c.beginPath();
	c.moveTo(5*sin,-5*cos);
	c.lineTo(30*sin,-30*cos);
	c.closePath();
	c.stroke();
	c.translate(-x,-y);
}
function draw_wall() {
	var px=100,py=100,len=200;

}

function time() {
	clean_board()
	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i]
		// console.log(p_all,pp.x)
		if (!(if_d&&if_a)) {
			if (if_d==1) {pp.facing+=10;pp.turn()}
			if (if_a==1) {pp.facing-=10;pp.turn()}
		}
		if (!(if_w&&if_s)) {
			if (if_w==1) {pp.x+=speed*pp.sin;pp.y-=speed*pp.cos}
			if (if_s==1) {pp.x-=speed*pp.sin;pp.y+=speed*pp.cos}
		}
		pp.move();
		draw_tank(pp.x,pp.y,pp.facing)
	}
	// var f = 0.5
	// for (var i = all_tanks.length - 1; i >= 0; i--) {
	// 	var tan = all_tanks[i];
	// 	var jx = tan[3],jy=tan[4];
	// 	var sin = Math.sin(all_tanks[i][2]*Math.PI/180);
	// 	var cos = Math.cos(all_tanks[i][2]*Math.PI/180);
	// 	// console.log(sin,cos,jx*sin+jy*cos)
	// 	var j = jx/sin
	// 	if (j>5) {jx=5*sin;jy=5*cos};
	// 	if (j<-5) {jx=-5*sin;jy=-5*cos};
		
	// 	// jx = jx*(j/j+f)
	// 	// jy = jy*(j/j+f)
	// 	// if (jx>0) {jx -= f*sin};
	// 	// if (jx<0) {jx += f*sin};
	// 	// if (jy>0) {jy -= f*cos};
	// 	// if (jy<0) {jy += f*cos};
	// 	if (Math.abs(jx)<=f*sin) {jx=0};
	// 	if (Math.abs(jy)<=f*cos) {jy=0};
	// 	all_tanks[i][3] = jx;
	// 	all_tanks[i][4] = jy;
	// 	all_tanks[i][0] = all_tanks[i][0]+jx*2;
	// 	all_tanks[i][1] = all_tanks[i][1]+jy*2;
	// 	// console.log(all_tanks[i])
	// }
	for (var i = all_bullets.length - 1; i >= 0; i--) {
		var bul = all_bullets[i]
		bul[0] = bul[0]+20*bul[2]
		bul[1] = bul[1]-20*bul[3]
		if (bul[0]<0) {all_bullets.splice(i,1)}
		if (bul[0]>1425) {all_bullets.splice(i,1)}
		if (bul[1]<0) {all_bullets.splice(i,1)}
		if (bul[1]>700) {all_bullets.splice(i,1)}

	}
}

function presskey(ev) {
	var c = ev.keyCode//,speed=2;
	// var sin = Math.sin(all_tanks[0][2]*Math.PI/180);
	// var cos = Math.cos(all_tanks[0][2]*Math.PI/180);
	// console.log(ev,c,x,y,jx,jy,'f',facing,sin,cos);
	console.log(ev,'down')
	switch(c){
	case 38:
	case 87://w
		// all_tanks[0][3] = all_tanks[0][3]+speed*sin;
		// all_tanks[0][4] = all_tanks[0][4]-speed*cos;
		if_w = 1
		break;
	case 83://s
	case 40:
		// all_tanks[0][3] = all_tanks[0][3]-speed*sin;
		// all_tanks[0][4] = all_tanks[0][4]+speed*cos;
		if_s = 1 
		break;
	case 39:
	case 68://d
		// all_tanks[0][2] += 10;
		if_d = 1
		break;
	case 37:
	case 65://a
		// all_tanks[0][2] -= 10;
		if_a = 1
		break;
	case 70:
		if_f = 1
		// all_bullets.push([100,100,0,1])
		break;
	}
	// all_bullets.push([all_tanks[0][0],all_tanks[0][1],sin,cos]);
}
function keyup(ev) {
	var c = ev.keyCode
	console.log(ev);
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

