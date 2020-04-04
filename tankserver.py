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
		self.init = False
		self.username = 'None'
		a_apps.append(self)
	
	def check_origin(self,origin):
		return True

	def open(self):
		print("WebSocket opened")
		
		if len(a_apps)%2 == 0:
			self.team = 'red'
		else:
			self.team = 'blue'
		# self.userid = len(a_onlineusers)+1

		cmsg = self.pack('connected','')
		self.write_message(cmsg)
		######################### write connected

##############################################################################################################################
		# while 1:
		# 	self.userid = random.randint(1,100000)
		# 	if self.userid in a_onlineusers:
		# 		continue
		# 	break	
		# a_onlineusers.append(self.userid)

		# umsg = self.pack('youruserid',{'userid':self.userid, 'username':self.username})
		# self.write_message(umsg)
		# ######################tell the userid

		
		# nt = Tank(self.userid,self.team)
		# self.tank = nt
		# a_tanks.append(nt)
		# ######################create a new Tank


		
		# alldata = []
		# for i in a_tanks:
		# 	alldata.append(i.data)
		# omsg = self.pack('onlineuser',alldata)
		# self.write_message(omsg)
		# ######################tell the online users

		# mmsg = self.pack('map',ori_map)
		# self.write_message(mmsg)
		# ######################down the map

##############################################################################################################################

	def on_message(self, message):
		if not check_message():
			return
		# cobj.onmsg(message)
		msg = json.loads(message)
		# print(msg,'#'*20)
		
		act = msg['action']
		data = msg['data']

		# print('message',message,nt)
		
		if act == 'login':
			for i in a_apps:
				if i.username == data[0]:
					umsg = self.pack('logerror','username has been used')
					self.write_message(umsg)
					return 
			
##############################################################################################################################
			if log(data[0],data[1]):

				self.username = data[0]
			else:
				umsg = self.pack('logerror','username or password is wrong')
				self.write_message(umsg)
				return
			
			while 1:
				self.userid = random.randint(1,100000)
				if self.userid in a_onlineusers:
					continue
				break
			a_onlineusers.append(self.userid)
			# print(a_onlineusers,a_tanks)
			
			umsg = self.pack('youruserid',{'userid':self.userid, 'username':self.username})
			self.write_message(umsg)
			######################tell the userid

			
			nt = Tank(self.userid,self.username,self.team,self)
			self.tank = nt
			a_tanks.append(nt)
			######################create a new Tank


			
			alldata = []
			for i in a_tanks:
				alldata.append(i.data)
			omsg = self.pack('onlineuser',alldata)
			self.write_message(omsg)
			######################tell the online users

			mmsg = self.pack('map',ori_map)
			self.write_message(mmsg)
			######################down the map

##############################################################################################################################
		if not self.userid == -1:
			index = a_onlineusers.index(self.userid)
			nt = a_tanks[index]
		
		if act == 'new_tank_come':
			pass
		elif act == 'pause':
			if self.username == 'pause':
				global if_pause
				if_pause = not if_pause
		
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
			text = data['text']
			if len(text) == 0:
				pass
			elif text[0] == '/':
				try:
					if text[1] == 'tp':
						self.tank.tp(text)
					else:
						dictdown = {}
						dictdown['text'] = 'command not found'
						dictdown['username'] = 'admin'
						dmsg = self.pack('sys_talk_down',dictdown)
						
						self.write_message(dmsg)
				except Exception as e:
					dictdown = {}
					dictdown['text'] = 'format error'
					dictdown['username'] = 'admin'
					dmsg = self.pack('sys_talk_down',dictdown)
					
					self.write_message(dmsg)


			else:
				dictdown = {}
				dictdown['text'] = data['text']
				dictdown['username'] = self.username
				dictdown['team'] = self.team
				dmsg = self.pack('talk_down',dictdown)
				for i in a_apps:
					i.write_message(dmsg)
			

	def on_close(self):
		index = a_onlineusers.index(self.userid)
		hii = a_tanks.pop(index)
		hi = a_onlineusers.pop(index)
		h = a_apps.pop(index)
		print('on_close',hi,hii.data)
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

def make_app():
	return tornado.web.Application(
		[
			(r"/", EchoWebSocket),
			(r"/home", MainHandler),
		],
		template_path=os.path.join(BASE_DIR, "templates"),
		static_path=os.path.join(BASE_DIR, "static")
	)

def check_message():
	return True

class Tank():
	def __init__(self,userid,username,team,ws):
		self.ws = ws
		self.userid = userid
		self.username = username
		self.facing = 0
		while True:
			self.x = random.randint(1,1425*2)
			self.y = random.randint(1,680*2)
			self.lines = get_abc(self.x, self.y, self.facing,50,40)
			if not self.if_collide():
				break

		self.sin = math.sin(self.facing*math.pi/180)
		self.cos = math.sin(self.facing*math.pi/180)
		self.if_w = False
		self.if_s = False
		self.if_a = False
		self.if_d = False
		self.if_f = False
		self.team = team
		self.bu_cd = 10
		self.health = 10
		self.turnspeed = 5
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['userid'] = self.userid
		self.data['team'] = self.team
		self.data['username'] = self.username
		# self.data['bu_cd'] = self.bu_cd
		self.data['lines'] = self.lines
		self.data['health'] = self.health
	def move(self):
		# print('move',self.if_w,self.if_s,self.if_a,self.if_d)
		if self.bu_cd > 0:
			self.bu_cd -= 1
				
		if self.if_f:
			if self.bu_cd == 0:
				self.bu_cd = 10
				newbullet = Bullet(self)

		if not(self.if_a and self.if_d):
			if self.if_d:
				self.facing += self.turnspeed
			elif self.if_a:
				self.facing -= self.turnspeed

			self.sin = math.sin(self.facing*math.pi/180)
			self.cos = math.cos(self.facing*math.pi/180)

		if not(self.if_w and self.if_s):
			if self.if_w:
				self.x = self.x+10*self.sin
				self.y = self.y-10*self.cos
			elif self.if_s:
				self.x = self.x-10*self.sin
				self.y = self.y+10*self.cos
		
		
		self.lines = get_abc(self.x, self.y, self.facing,50,40)
		if self.if_collide():

			if not(self.if_w and self.if_s):
				if self.if_w:
					self.x = self.x-10*self.sin
					self.y = self.y+10*self.cos
				elif self.if_s:
					self.x = self.x+10*self.sin
					self.y = self.y-10*self.cos
		self.lines = get_abc(self.x, self.y, self.facing,50,40)

		if self.if_collide():
			if not(self.if_a and self.if_d):
				if self.if_d:
					self.facing -= self.turnspeed
				elif self.if_a:
					self.facing += self.turnspeed

			self.sin = math.sin(self.facing*math.pi/180)
			self.cos = math.cos(self.facing*math.pi/180)
		

		self.lines = get_abc(self.x, self.y, self.facing,50,40)
		self.data['x'] = int(self.x)
		self.data['y'] = int(self.y)
		self.data['facing'] = self.facing
		self.data['lines'] = self.lines
		self.data['health'] = self.health
		# print(self.data)

	def health_change(self,h,fromtank):
		self.health += h
		if self.health == 0:
			
			dictdown = {}
			dictdown['team1'] = fromtank.team
			dictdown['name1'] = fromtank.username
			dictdown['team2'] = self.team
			dictdown['name2'] = self.username
			dmsg = self.pack('destroy',dictdown)
			print(dictdown)
			for i in a_apps:
				i.write_message(dmsg)

			self.health = 10
			self.facing = 0
			
			while True:
				self.x = random.randint(1,1425*2)
				self.y = random.randint(1,680*2)
				self.lines = get_abc(self.x, self.y, self.facing,50,40)
				if not self.if_collide():
					break

		elif self.health > 10:
			self.health = 10
	
	def if_collide(self, lines = 1):
		# lines = self.lines
		if lines == 1:
			lines = self.lines
		for i in a_tanks:
			if i == self:
				continue
			if_in = if_impact(lines,i.lines)
			if if_in:
				return True
		
		for i in a_walls:
			if_in = if_impact(lines,i)
			if if_in:
				return True

		if if_out(lines):
			return True
		
		return False

	def tp(self,text):
		try:
			i = 0
			fi = 0
			l = []
	
			x = int(text[2])
			y = int(text[3])

			if len(text) == 5:
				facing = int(text[4])
			else:
				facing = self.facing
			newlines = get_abc(x, y, facing,50,40)
			if self.if_collide(newlines):
				dictdown = {}
				dictdown['text'] = 'teleport error:a collision happens'
				dictdown['username'] = 'admin'
				dmsg = self.pack('sys_talk_down',dictdown)
				
				self.ws.write_message(dmsg)
			else:
				self.x = x
				self.y = y
				if len(text) == 5:
					self.facing = facing

		except Exception as e:
			print(e)
			dictdown = {}
			dictdown['text'] = 'teleport error:format error'
			dictdown['username'] = 'admin'
			dmsg = self.pack('sys_talk_down',dictdown)
			
			self.ws.write_message(dmsg)
			

 
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
	def __init__(self,tank):
		self.tank = tank
		self.facing = tank.facing
		self.sin = math.sin(self.facing*math.pi/180)
		self.cos = math.cos(self.facing*math.pi/180)
		self.x = tank.x+50*self.sin
		self.y = tank.y-50*self.cos
		self.team = tank.team
		self.dead = False
		self.stop = False
		self.lines = get_abc(self.x, self.y, self.facing,30,5)
		self.formerlines = []
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['team'] = self.team
		a_bullets.append(self)
		self.if_collide()
		# self.data['userid'] = self.userid
	
	def move(self):
		if self.stop:
			return

		if self.dead == True:
			return
		
		self.x = self.x+50*self.sin
		self.y = self.y-50*self.cos
		self.lines = get_abc(self.x, self.y, self.facing,30,10)
		self.data['x'] = int(self.x)
		self.data['y'] = int(self.y)
		self.data['lines'] = self.lines
		self.if_collide()
	
	def if_collide(self):
		for i in a_tanks:
			if i == self.tank:
				continue
			if_in = if_impact(self.lines, i.lines)
			
			if if_in:
				i.health_change(-1,self.tank)
				self.dead = True
				a_bullets.pop(a_bullets.index(self))
				return
		
		for i in a_walls:
			if_in = if_impact(self.lines,i)
			if if_in:
				self.dead = True
				a_bullets.pop(a_bullets.index(self))
				return

		if if_out(self.lines):
			self.dead = True
			a_bullets.pop(a_bullets.index(self))
			return



def if_impact(line1,line2):
	
	def get_xy(l1,l2):
		a1,b1,c1 = l1
		a2,b2,c2 = l2
		x = (b1*c2-b2*c1)/(b2*a1-b1*a2)
		y = (a1*c2-a2*c1)/(a2*b1-a1*b2)
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


	l21 = line2[0]
	l22 = line2[1]
	l23 = line2[2]
	l24 = line2[3]
	x21,y21 = get_xy(l21,l23)
	x22,y22 = get_xy(l22,l23)
	x23,y23 = get_xy(l21,l24)
	x24,y24 = get_xy(l22,l24)
	x21 = round(x21,3)
	x22 = round(x22,3)
	x23 = round(x23,3)
	x24 = round(x24,3)
	y21 = round(y21,3)
	y22 = round(y22,3)
	y23 = round(y23,3)
	y24 = round(y24,3)
	p2 = [(x21,y21),(x22,y22),(x23,y23),(x24,y24)]

	for i in p1:
		x = i[0]
		y = i[1]
		i1 = line2[0]
		c1 = -i1[0]*x-i1[1]*y
		i2 = line2[1]

		i3 = line2[2]
		c2 = -i3[0]*x-i3[1]*y
		i4 = line2[3]
		# print(c1,i1[2],i2[2],'c1,c2',c2,i3[2],i4[2],'x,y',x,y)
		if c1 <= max(i1[2],i2[2]) and c1 >= min(i1[2],i2[2]) and c2 <= max(i3[2],i4[2]) and c2 >= min(i3[2],i4[2]):
			return True
	
	for i in p2:
		x = i[0]
		y = i[1]
		i1 = line1[0]
		c1 = -i1[0]*x-i1[1]*y
		i2 = line1[1]

		i3 = line1[2]
		c2 = -i3[0]*x-i3[1]*y
		i4 = line1[3]
		# print(c1,i1[2],i2[2],'c1,c2',c2,i3[2],i4[2],'x,y',x,y)
		if c1 <= max(i1[2],i2[2]) and c1 >= min(i1[2],i2[2]) and c2 <= max(i3[2],i4[2]) and c2 >= min(i3[2],i4[2]):
			return True
	return False

def if_out(line):

	def get_xy(l1,l2):
		a1,b1,c1 = l1
		a2,b2,c2 = l2
		x = (b1*c2-b2*c1)/(b2*a1-b1*a2)
		y = (a1*c2-a2*c1)/(a2*b1-a1*b2)
		return (x,y)

	l11 = line[0]
	l12 = line[1]
	l13 = line[2]
	l14 = line[3]
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

	for m,n in p1:
		if m>=mapx or m<=0 or n>=mapy or n<=0:
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

def get_kxy(x1,y1,x2,y2):
	k = (y1-y2)/(x1-x2)
	b = (x1*y2-x2*y1)/(x1-x2)
	k = round(k,10)
	b = round(b,10)
	return (k,b)

def read_map(file='maps.txt'):
	ifhave=os.path.exists('maps.txt')
	if not ifhave:
		return False
	with open('maps.txt','r') as f:
		j = f.read()
		walls = json.loads(j)
		for i in walls:
			ori_map.append(i)
			if i[-1]==1:
				continue
			lines = get_abc(i[0],i[1],i[2],i[3],i[4])
			a_walls.append(lines)
		f.close()

def log(username,password):
	if username == 'pause':
		if password == '1':
			return True
		else:
			return False
	elif username == 'admin':
		return False
	else:
		return True

async def time_loop():
	while True:
		nxt = tornado.gen.sleep(0.025)   # Start the clock.
		await pertime()   # Run while the clock is ticking.
		await nxt

async def pertime():
	if not if_pause:
		for i in a_bullets:
			# print(i.data)
			i.move()
		for i in range(len(a_tanks)):
				a_tanks[i].move()
				a_apps[i].downmsg()


if __name__ == "__main__":
	if_pause = False
	pie = 3.1415926535898
	app = make_app()
	a_apps = []
	a_onlineusers = []
	a_tanks = []
	a_bullets = []
	a_walls = []
	a_lines = []
	ori_map = []
	read_map()
	mapx = 2850
	mapy = 1360
	app.listen(8888)
	tornado.ioloop.IOLoop.current().spawn_callback(time_loop)
	tornado.ioloop.IOLoop.current().start()
