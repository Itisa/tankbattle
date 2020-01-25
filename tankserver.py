import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.gen
import json
import random
import math
import os
import threading
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class MainHandler(tornado.web.RequestHandler):

	def get(self):
		items = []
		self.render("tank_battle.html", title="My title", items=items)
		# self.write('123456')
		# return '1'
	
	def OPTIONS(self):
		pass

	def post(self):
		print(a_tanks,a_onlineusers)

class EchoWebSocket(tornado.websocket.WebSocketHandler):
	def __init__(self,a,b):
		super(EchoWebSocket,self).__init__(a,b)
		self.userid = -1
		self.tank = -1
		self.team = 'red'
		a_apps.append(self)
	
	def check_origin(self,origin):
		return True

	def open(self):
		print("WebSocket opened")
		while 1:
			self.userid = random.randint(1,100000)
			if self.userid in a_onlineusers:
				continue
			break
		
		if len(a_apps)%2 == 0:
			self.team = 'red'
		else:
			self.team = 'blue'
		# self.userid = len(a_onlineusers)+1

		a_onlineusers.append(self.userid)
		print(a_onlineusers,a_tanks)
		cmsg = self.pack('connected','')
		self.write_message(cmsg)
		######################### write connected
		
		umsg = self.pack('youruserid',{'userid':self.userid})
		self.write_message(umsg)
		######################tell the userid

		nt = Tank(self.userid,self.team)
		self.tank = nt
		a_tanks.append(nt)
		######################create a new Tank
		
		alldata = []
		for i in a_tanks:
			alldata.append(i.data)
		omsg = self.pack('onlineuser',alldata)
		self.write_message(omsg)
		######################tell the online users

	def on_message(self, message):
		# cobj.onmsg(message)
		msg = json.loads(message)
		# print(msg,'#'*20)
		
		act = msg['action']
		data = msg['data']
		index = a_onlineusers.index(self.userid)
		nt = a_tanks[index]
		# print('message',message,nt)
		if act == 'new_tank_come':
			pass
		
		elif act == 'keydown':
			if data =='w':
				nt.if_w = True
			elif data =='s':
				nt.if_s = True
			elif data =='a':
				nt.if_a = True
			elif data =='d':
				nt.if_d = True
			elif data =='f':
				nt.if_f = True

		elif act == 'keyup':
			if data =='w':
				nt.if_w = False
			elif data =='s':
				nt.if_s = False
			elif data =='a':
				nt.if_a = False
			elif data =='d':
				nt.if_d = False
			elif data =='f':
				nt.if_f = False
		elif act == 'talk_up':
			print('talk',data)
			dictdown = {}
			dictdown['text'] = data['text']
			dictdown['userid'] = self.userid
			dictdown['team'] = self.team
			dmsg = self.pack('talk_down',dictdown)
			for i in a_apps:
				i.write_message(dmsg)
		

	def on_close(self):
		index = a_onlineusers.index(self.userid)
		hii = a_tanks.pop(index)
		hi = a_onlineusers.pop(index)
		print(hi,hii.data)
		print("WebSocket closed")

	def pack(self,action,data):
		dmsg = {}
		dmsg['action'] = action
		if data != '':
			dmsg['data'] = data
		jsmsg = json.dumps(dmsg)
		return jsmsg

	def downmsg(self):
		alldata = [[],[]]
		for i in a_tanks:
			alldata[0].append(i.data)
		for i in a_bullets:
			alldata[1].append(i.data)
		omsg = self.pack('move_all',alldata)
		self.write_message(omsg)


	def move(self):
		index = a_onlineusers.index(self.userid)
		nt = a_tanks[index]
		nt.move()

def make_app():
	return tornado.web.Application(
		[
			(r"/", EchoWebSocket),
			(r"/home", MainHandler),
		],
		template_path=os.path.join(BASE_DIR, "templates"),
		static_path=os.path.join(BASE_DIR, "static")
	)

class Tank():
	def __init__(self,userid,team):
		self.userid = userid
		self.x = random.randint(1,1400)
		self.y = random.randint(1,700)
		self.facing = 0
		self.sin = math.sin(self.facing*math.pi/180)
		self.cos = math.sin(self.facing*math.pi/180)
		self.if_w = False
		self.if_s = False
		self.if_a = False
		self.if_d = False
		self.if_f = False
		self.team = team
		self.bu_cd = 10
		self.lines = get_abc(self.x, self.y, self.facing,50,40)
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['userid'] = self.userid
		self.data['team'] = self.team
		self.data['bu_cd'] = self.bu_cd
		self.data['lines'] = self.lines
	def move(self):
		# print('move',self.if_w,self.if_s,self.if_a,self.if_d)
		if self.bu_cd > 0:
			self.bu_cd -= 1
		if not(self.if_w and self.if_s):
			if self.if_w:
				self.x = self.x+10*self.sin
				self.y = self.y-10*self.cos
			elif self.if_s:
				self.x = self.x-10*self.sin
				self.y = self.y+10*self.cos
		if not(self.if_a and self.if_d):
			if self.if_d:
				self.facing += 10
			elif self.if_a:
				self.facing -= 10

			self.sin = math.sin(self.facing*math.pi/180)
			self.cos = math.cos(self.facing*math.pi/180)
				
		if self.if_f:
			if self.bu_cd == 0:
				self.bu_cd = 10
				newbullet = Bullet(self.x,self.y,self.facing)
				a_bullets.append(newbullet)

		self.lines = get_abc(self.x, self.y, self.facing,50,40)
		self.data['x'] = int(self.x)
		self.data['y'] = int(self.y)
		self.data['facing'] = self.facing
		self.data['lines'] = self.lines
		# print(self.data)


	def pack(self,action,data):
		dmsg = {}
		dmsg['action'] = action
		if data != '':
			dmsg['data'] = data
		jsmsg = json.dumps(dmsg)
		return jsmsg

	def fire(self):
		pass

class Bullet():
	def __init__(self,x,y,facing):
		self.facing = facing
		self.sin = math.sin(self.facing*math.pi/180)
		self.cos = math.cos(self.facing*math.pi/180)
		self.x = x+50*self.sin
		self.y = y-50*self.cos
		self.dead = False
		self.lines = get_abc(self.x, self.y, self.facing,30,10)
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		# self.data['userid'] = self.userid
	
	def move(self):
		if self.x >= 1400 or self.x <= 0 or self.y >= 680 or self.y <=0:
			self.dead = True
			a_bullets.pop(a_bullets.index(self))
		if self.dead == True:
			return
		
		self.x = self.x+20*self.sin
		self.y = self.y-20*self.cos
		self.lines = get_abc(self.x, self.y, self.facing,30,10)
		self.data['x'] = int(self.x)
		self.data['y'] = int(self.y)
		self.data['lines'] = self.lines
		self.if_collide()
	
	def if_collide(self):
		for i in a_tanks:
			pass

def get_abc(x,y,facing,l,w):
	cos = math.cos(facing*math.pi/180)
	sin = math.sin(facing*math.pi/180)
	if facing%180 == 90:
		a1 = 1
		b1 = 0
		c1 = -x
		a2 = 1
		b2 = 0
		c2 = -x+w*sin
		a3 = 0
		b3 = 1
		c3 = -y
		a4 = 0
		b4 = 1
		c4 = -y+l*sin
		# ax+by+c = 0
		li = [(0,1,-y-(w/2)*sin),(0,1,-y+(w/2)*sin),(1,0,-x-(l/2)*sin),(1,0,-x+(l/2)*sin)]
		return li
	elif facing%180 == 0:
		li = [(1,0,-x-(w/2)*cos),(1,0,-x+(w/2)*cos),(0,1,-y+(l/2)*cos),(0,1,-y-(l/2)*cos)]
		return li
	else:
		# tan1 = math.tan(facing*math.pi/180)
		# tan2 = w/l
		# tan3 = ((tan1-tan2)/(1+tan1*tan2))
		

		# if tan == 0:
		# 	k1,b1 = (round(x),0.0)
		# else:
		# 	k1,b1 = get_kxy(x-y/tan,0,x,y)
		# k2 = k1
		# b2 = w/cos+b1
		# k3 = -x/k1
		# b3 = x/k1+y
		# k4 = -x/k1
		# b4 = y-l*sin+(x-l*cos)/k1
		# cos2 = l/math.sqrt(w*w+l*l)
		# cos3 = cos*cos2+


		tan1 = math.tan(facing*math.pi/180)
		tan2 = l/w
		tan3 = ((tan1-tan2)/(1+tan1*tan2))
		cos1 = math.cos(facing*math.pi/180)
		cos2 = w/math.sqrt(w*w+l*l)
		cos3 = cos1*cos2+tan1*cos1*tan2*cos2

		k,b = get_kxy(x-y/tan3,0,x,y) #对角线(左下—>右上)
		move_x = math.sqrt(w*w+l*l)/2*cos3
		move_y = move_x*k

		# poa = (x+move_x,y+move_y)  #position a
		xa = x+move_x
		ya = y+move_y
		k3,b3 = get_kxy(xa-ya/tan1,0,xa,ya)
		k4 = k3
		b4 = b3+l/cos1
		k1 = 0
		b1 = 0
		k2 = 0
		b2 = 0
		
		# return [(1,0,-20),(1,0,-30),(k3,-1,b3),(k4,-1,b4)]
		return [(k1,-1,b1),(k2,-1,b2),(k3,-1,b3),(k4,-1,b4)]

def get_abc_bullet(x,y,facing,l,w):
	if facing%180 == 90:
		# ax+by+c = 0
		li = [(0,1,-y-(w/2)*sin),(0,1,-y+(w/2)*sin),(1,0,-x-(l/2)*sin),(1,0,-x+(l/2)*sin)]
		return li
	elif facing%180 == 0:
		li = [(1,0,-x-(w/2)*cos),(1,0,-x+(w/2)*cos),(0,1,-y+(l/2)*cos),(0,1,-y-(l/2)*cos)]
		return li

def get_kxy(x1,y1,x2,y2):
	k = (y1-y2)/(x1-x2)
	b = (x1*y2-x2*y1)/(x1-x2)
	k = round(k,10)
	b = round(b,10)
	return (k,b)

async def time_loop():
	while True:
		nxt = tornado.gen.sleep(0.05)   # Start the clock.
		await pertime()  # Run while the clock is ticking.
		await nxt

async def pertime():
	for i in a_bullets:
		# print(i.data)
		i.move()
	for i in range(len(a_tanks)):
			a_tanks[i].move()
			a_apps[i].downmsg()


if __name__ == "__main__":
	pie = 3.1415926535898
	app = make_app()
	a_apps = []
	a_onlineusers = []
	a_tanks = []
	a_bullets = []
	a_lines = []
	app.listen(8888)
	tornado.ioloop.IOLoop.current().spawn_callback(time_loop)
	tornado.ioloop.IOLoop.current().start()
