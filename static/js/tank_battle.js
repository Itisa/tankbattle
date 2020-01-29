var sett,f=0.25,size=1,speed=10,gt=0
var jx=0,jy=0 //jia1 su4 du4
var if_w=0,if_s=0,if_a=0,if_d=0,if_f=0,if_q=0,if_e=0,if_begin=false
var ifconnected = false
var myx = 0,myy = 0
//userid,username,x,y,facing,team
// var p = new Tank(1,'321',200,100,130,'red')
// var mt = new Tank(1,'321',200,300,330,'red')
var map1 = [[1,50,200,200,20],[1,100,100,20,200],[1,600,50,200,20],[1,300,300,20,200],[1,450,200,20,200],[1,600,300,20,300],[1,700,200,100,20],[1,800,400,20,150],[1,950,300,300,20]]
var bx = new Bullet(0,0,0,0,true)
var p_all=[],b_all = [bx],w_all = []
var text = [['hello','blue','hi','red',100]],talk=[];
//x,y,facing,jx,jy


var thisuserid = Math.floor(Math.random()*100000);


function pack_post(action,data) {
	var postdict = {};
	postdict['data'] = data;
	postdict['action'] = action;
	postdict['thisuserid'] = thisuserid;
	var ss = JSON.stringify(postdict);
	postdata(postdict)
}


function pack(action,data) {
	var postdict = {};
	postdict['data'] = data;
	postdict['action'] = action;
	postdict['thisuserid'] = thisuserid;
	var ss = JSON.stringify(postdict);
	return postdict;
}
function postkey(method,key) {
	if (method=='down') {
		var post = pack('keydown',key);
		postdata(post);
	}
	else if (method=='up') {
		var post = pack('keyup',key);
		postdata(post);
	}
}


function init() {
	if (if_begin==false) {
		sett = setInterval(time,25);
		if_begin=true;
	}
}

function wait() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
		
	var doc = document.getElementsByTagName('button')
	for (var i = 0; i < doc.length; i++) {doc[i].hidden = true}
	doc = document.getElementsByTagName('p')
	for (var i = 0; i < doc.length; i++) {doc[i].hidden = true}
	doc = document.getElementsByTagName('a')
	for (var i = 0; i < doc.length; i++) {doc[i].hidden = true}
	// doc = document.getElementsByTagName('input');
	// for (var i = 0; i < doc.length; i++) {doc[i].hidden = true}
	document.getElementById('get_username').hidden = true;
	document.getElementById('password').hidden = true;

	adjustCanvas(canvas,c)
	c.font = "30px bold 黑体";
	c.fillText('Wait to begin',600,300);
	c.stroke()
	var username = '123',userid = 1234
	c.font = "15px bold 黑体";
	c.fillText('username:'+username,10,20)
	c.fillText('userid:'+userid,10,40)
	c.stroke()
	// init()
}

function clean_board() {
	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	c.clearRect(0,0,1425,1000)
}

function draw_tank(pp) {
	//x,y,facing,health,bu_cd,team
	// var sin=pp.sin, cos=pp.cos, team=pp.team, bu_cd=pp.bu_cd, health=pp.health, gsin=pp.gsin, gcos=pp.gcos
	var sin = Math.sin(pp.facing*Math.PI/180);
	var cos = Math.cos(pp.facing*Math.PI/180);
	var gsin = sin;
	var gcos = cos;
	var team = pp.team
	// console.log(pp)
	var lines = pp.lines
	var health = pp.health



	var canvas = document.getElementById('main');
	var c = canvas.getContext("2d");
	c.beginPath();
	// var sin = Math.sin(facing*Math.PI/180);
	// var cos = Math.cos(facing*Math.PI/180);

	c.translate(pp.x+myx,pp.y+myy);

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
	c.moveTo((-10*gcos+15*gsin)*size,(-10*gsin-15*gcos)*size);
	c.lineTo((-10*gcos-5*gsin)*size,(-10*gsin+5*gcos)*size);
	c.lineTo((10*gcos-5*gsin)*size,(10*gsin+5*gcos)*size);
	c.lineTo((10*gcos+15*gsin)*size,(10*gsin-15*gcos)*size);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2*size;
	c.stroke();
	
	//gun
	c.beginPath();
	// c.moveTo(0*cos+5*sin,0*sin-5*cos)
	// c.lineTo(0*cos+30*sin,0*sin-30*cos)
	c.moveTo((5*gsin)*size,(-5*gcos)*size);
	c.lineTo((30*gsin)*size,(-30*gcos)*size);
	c.closePath();
	c.strokeStyle = 'black';
	c.lineWidth = 2*size;
	c.stroke();
	
	//username
	c.fillStyle="#000000";
	c.fillText(myusername,100,10);

	//lines
	// console.log(lines)

	// var l = lines[0];
	// draw_line(l[0],l[1],l[2],'red');
	// var l = lines[1];
	// draw_line(l[0],l[1],l[2],'yellow');
	// var l = lines[2];
	// draw_line(l[0],l[1],l[2],'blue');
	// var l = lines[3];
	// draw_line(l[0],l[1],l[2],'green');

	// console.log(lines[0])
	// draw_line(1,-1,0)
	// draw_line(1,0,-100)

	// for (var i = 0; i < lines.length; i++) {
	// 	var l = lines[i];
	// 	draw_line(l[0],l[1],l[2])
	// }

	//health bar
	c.beginPath();
	var hea = health*3-15
	c.moveTo((-15*gcos-10*gsin)*size,(-15*gsin+10*gcos)*size);
	c.lineTo((hea*gcos-10*gsin)*size,(hea*gsin+10*gcos)*size);
	c.closePath();
	c.strokeStyle = 'red';
	c.lineWidth = 5*size;
	c.stroke()

	c.translate(-pp.x-myx,-pp.y-myy);
	// //gun_cd bar
	// c.beginPath();
	// var cd_b = bu_cd*(-3)+15
	// c.moveTo((-15*gcos-18*gsin)*size,(-15*gsin+18*gcos)*size);
	// c.lineTo((cd_b*gcos-18*gsin)*size,(cd_b*gsin+18*gcos)*size);
	// c.closePath();
	// c.strokeStyle = 'black';
	// c.lineWidth = 5*size;
	// c.stroke()

}

function draw_bullet(bb) {

	var can = document.getElementById('main');
	var c = can.getContext("2d");

	var x = bb.x ,y=bb.y
	var team = bb.team
	var sin = Math.sin(bb.facing*Math.PI/180);
	var cos = Math.cos(bb.facing*Math.PI/180);

	c.translate(x+myx,y+myy);
	c.beginPath();
	////x' = x*cos - y*sin
	////y' = x*sin + y*cos
	var l = 15
	var w = 5/2
	c.moveTo((-w*cos+l*sin)*size, (-w*sin-l*cos)*size);
	c.lineTo((w*cos+l*sin)*size, (w*sin-l*cos)*size);
	c.lineTo((w*cos-l*sin)*size, (w*sin+l*cos)*size);
	c.lineTo((-w*cos-l*sin)*size, (-w*sin+l*cos)*size);
	
	c.closePath();
	c.strokeStyle = team;
	c.lineWidth = 5*size;
	c.stroke();

	c.translate(-x-myx,-y-myy);

	// var l = lines[0];
	// draw_line(l[0],l[1],l[2],'red');
	// var l = lines[1];
	// draw_line(l[0],l[1],l[2],'yellow');
	// var l = lines[2];
	// draw_line(l[0],l[1],l[2],'blue');
	// var l = lines[3];
	// draw_line(l[0],l[1],l[2],'green');
}

function draw_text() {
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.font = "20px bold 黑体";
	c.fillStyle = "#ff0";
	
	// for (var i = 0; i < text.length; i++) {
	// 	text[i][4] -= 1;
	// 	if (text[i][4]==0) {
	// 		text.splice(i,1);
	// 		continue;
	// 	}
	// 	var tt = text[i];
	// 	c.textAlign = "right";
	// 	c.fillStyle = tt[1];
	// 	c.fillText(tt[0],1290,200+20*i);
	// 	// x += (tt[0].length+2)*10
	// 	c.textAlign = "left";
	// 	c.fillStyle = 'black';
	// 	c.fillText('kills',1300,200+20*i)
	// 	// x += (tt[2].length+2)*10
	// 	c.textAlign = "left";
	// 	c.fillStyle = tt[3];
	// 	c.fillText(tt[2],1350,200+20*i);
	// 	// c.fillText(text[i][0],text[i][1],text[i][2]);
	// }
	for (var i = 0; i < talk.length; i++) {
		var t = talk[i]
		// text,userid,team
		draw_talk(1200,200+20*i,t[0],t[1],t[2])
		t[3] -= 1
		if (t[3]<=0) {talk.splice(i,1)}
	}


	
}

function draw_talk(x,y,text,username,team) {

	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.font = "20px bold 黑体";
	c.fillStyle = team;
	var t = username+':'+text
	c.fillText(text,x,y)
}

function draw_line(m,n,o,colour='black') {

	// console.log(m,n,o)
	var can = document.getElementById('main');
	var c = can.getContext("2d");

	c.beginPath();
	
	if (n == 0) {
		c.moveTo(-o/m,0)
		c.lineTo(-o/m,680);
	}
	else {
		c.moveTo(0,-o/n);
		c.lineTo(1470, -(1470*m+o)/n);
	}
	c.strokeStyle = colour
	c.lineWidth = 2;
	c.stroke();

}

function draw_map() {
	for (var i = 0; i < w_all.length; i++) {
		var ww = w_all[i];
		draw_wall(ww)

	}

}

function draw_wall(ww) {
	//x,y,facing,l,w
	var can = document.getElementById('main');
	var c = can.getContext("2d");
	c.translate(ww[0]+myx,ww[1]+myy);

	var sin = Math.sin(ww[2]*Math.PI/180);
	var cos = Math.cos(ww[2]*Math.PI/180);
	var l=ww[3]/2, w=ww[4]/2;
	c.beginPath();
	c.moveTo((-w*cos+l*sin)*size, (-w*sin-l*cos)*size);
	c.lineTo((w*cos+l*sin)*size, (w*sin-l*cos)*size);
	c.lineTo((w*cos-l*sin)*size, (w*sin+l*cos)*size);
	c.lineTo((-w*cos-l*sin)*size, (-w*sin+l*cos)*size);
	c.closePath();
	if (ww[5]==1) {
		c.strokeStyle = 'black';
		c.stroke();
	}
	else {
		c.fillStyle = 'black';
		c.fill();
	}
	
	c.translate(-ww[0]-myx,-ww[1]-myy)
}

///////////////////////////////////////////////////////////////////////////////////////
function draw_board(bo) {
	// console.log(bo)
	var can = document.getElementById('main');
	var c = can.getContext("2d");

	for (var i = 0; i < bo.length; i++) {
		var ba = bo[i];
		for (var i1 = 0; i1 < ba.length; i1++) {
			var bb = ba[i1];
			// console.log(bb)
			if (bb==''){}
			else {
				// console.log(i,i1);
				c.strokeStyle = 'black';
				// c.fillRect(i,i1,i+1,i1+1)
				c.translate(i,i1);
				c.beginPath();
				c.moveTo(0,0);
				c.lineTo(0,1);	
				
				c.lineWidth = 2;
				c.stroke();
				c.translate(-i,-i1);
			}	
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////

function post_userinfo() {
	username = document.getElementById('get_username').value
	password = document.getElementById('password').value
	pack_post('login',[username,password])
}

function talk_post() {
	var data = {}
	var text = document.getElementById('talk').value
	if (text==""){
		return
	}
	else {
		data['text'] = text
		data['username'] = myusername
		onmsg = pack('talk_up',data)
		postdata(onmsg)
		document.getElementById('talk').value = ''
	}
}
function talk(ev) {
	// body...
}



function time() {
	clean_board()
	// console.log(p_all)
	draw_text()
	draw_map()


	// console.log('in',b_all)
	for (var i = b_all.length - 1; i >= 0; i--) {
		var bb = b_all[i];
		// if (bb.stop==true) {continue;}
		// console.log(bb.x, bb.y, sin, cos)
		draw_bullet(bb);
	}
	
	for (var i = 0; i < p_all.length; i++) {
		var pp = p_all[i];
		// draw_tank(pp.x, pp.y, pp.facing, pp.health, pp.bu_cd, pp.team);
		draw_tank(pp);
	}
}

function keydown(ev) {
	var c = ev.keyCode;
	// console.log(ev,c)
	switch(c){
	case 38:
	case 87://w
		postkey('down','w');
		// if_w = 1;
		break;
	case 83://s
	case 40:
		postkey('down','s');
		// if_s = 1;
		break;
	case 39:
	case 68://d
		postkey('down','d');
		// if_d = 1;
		break;
	case 37:
	case 65://a
		postkey('down','a');
		// if_a = 1;
		break;
	case 70://f
	case 32://space
		postkey('down','f');
		// if_f = 1;
		break;
	case 81://q
	case 90://z
		if_q = 1;
		break;
	case 69://e
	case 88://x
		if_e = 1;
		break;
	case 13://enter
		talk_post()
		break;
	}
}
function keyup(ev) {
	var c = ev.keyCode
	switch(c){
	case 38:
	case 87://w
		postkey('up','w');
		// if_w = 0;
		break;
	case 83://s
	case 40:
		postkey('up','s');
		// if_s = 0;
		break;
	case 39:
	case 68://d
		postkey('up','d');
		// if_d = 0;
		break;
	case 37:
	case 65://a
		postkey('up','a');
		// if_a = 0;
		break;
	case 70:
	case 32:
		postkey('up','f');
		// if_f = 0;
		break;
	case 81://q
	case 90://z
		if_q = 0;
		break;
	case 69://e
	case 88://x
		if_e = 0;
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

// wait()
// init()
