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
			if_in = if_impact(self.lines, i.lines)
			
			if if_in:
				print('in','266')


def if_impact(line1,line2):
	# print('line1:',line1)
	# print('line2:',line2)
	for i in line1:
		if i[1] == 0:
			return False
	for i in line2:
		if i[1] == 0:
			return False


	#if line1 in line2
	def get_xy(l1,l2):
		x = -(l1[2]-l2[2])/(l1[0]-l2[0])
		y = l1[0]*x + l1[2]
		return (x,y)
	
	l11 = line1[0]
	l12 = line1[1]
	l13 = line1[2]
	l14 = line1[3]
	x11,y11 = get_xy(l11,l13)
	x12,y12 = get_xy(l12,l13)
	x13,y13 = get_xy(l11,l14)
	x14,y14 = get_xy(l12,l14)
	x11 = round(x11,3)
	x12 = round(x12,3)
	x13 = round(x13,3)
	x14 = round(x14,3)
	y11 = round(y11,3)
	y12 = round(y12,3)
	y13 = round(y13,3)
	y14 = round(y14,3)
	
	p1 = [(x11,y11),(x12,y12),(x13,y13),(x14,y14)]
	# print(p1)
	x1max = max(x11,x12,x13,x14)
	x1min = min(x11,x12,x13,x14)
	y1max = max(y11,y12,y13,y14)
	y1min = min(y11,y12,y13,y14)
	

	l21 = line2[0]
	l22 = line2[1]
	l23 = line2[2]
	l24 = line2[3]
	x21,y21 = get_xy(l21,l23)
	x22,y22 = get_xy(l22,l23)
	x23,y23 = get_xy(l21,l24)
	x24,y24 = get_xy(l22,l24)
	x2max = max(x21,x22,x23,x24)
	x2min = min(x21,x22,x23,x24)
	y2max = max(y21,y22,y23,y24)
	y2min = min(y21,y22,y23,y24)
	
	for i in p1:
		x = i[0]
		y = i[1]
		x2all = []
		y2all = []
		for i1 in line2:
			yn = i1[0]*x+i1[2]
			
			if yn <= y2max and yn >= y2min:
				y2all.append(yn)

		for i1 in line2:
			xn = (y-i1[2])/i1[0]
		
			# print(xn,'xn')
		
			if xn <= x2max and xn >= x2min:
				x2all.append(xn)

		# print(x2max,x2min)
		if x2all == [] or y2all == []:
			continue
		if x <= max(x2all) and x>= min(x2all) and y<= max(y2all) and y>= min(y2all):
			return True

	return False


def get_abc(x,y,facing,l,w):
	cos = math.cos(facing*math.pi/180)
	sin = math.sin(facing*math.pi/180)
	if facing%180 == 90:
		li = [(0,-1,y+(w/2)*sin),(0,-1,y-(w/2)*sin),(1,0,-x-(l/2)*sin),(1,0,-x+(l/2)*sin)]
		return li
	elif facing%180 == 0:
		li = [(1,0,-x-(w/2)*cos),(1,0,-x+(w/2)*cos),(0,-1,y-(l/2)*cos),(0,-1,y+(l/2)*cos)]
		return li
	else:
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
		k1 = -1/k3
		b1 = ya+xa/k3
		k2 = k1
		b2 = b1-w/cos1/tan1
		
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
