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
		alldata = []
		for i in a_tanks:
			alldata.append(i.data)
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
		self.pie = 3.1415926535
		self.x = random.randint(1,1400)
		self.y = random.randint(1,700)
		self.facing = 0
		self.sin = math.sin(self.facing*self.pie/180)
		self.cos = math.sin(self.facing*self.pie/180)
		self.if_w = False
		self.if_s = False
		self.if_a = False
		self.if_d = False
		self.if_f = False
		self.team = team
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['userid'] = self.userid
		self.data['team'] = self.team
	
	def move(self):
		# print('move',self.if_w,self.if_s,self.if_a,self.if_d)
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

			self.sin = math.sin(self.facing*self.pie/180)
			self.cos = math.cos(self.facing*self.pie/180)
				
		if self.if_f:
			pass
		self.data['x'] = int(self.x)
		self.data['y'] = int(self.y)
		self.data['facing'] = self.facing
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
		self.pie = 3.1415926535
		self.x = x
		self.y = y
		self.facing = facing
		self.sin = math.sin(self.facing*pie/180)
		self.cos = math.cos(self.facing*pie/180)
		self.dead = False
	def move(self):
		if self.dead == True:
			return
		self.x = int(self.x+10*self.sin)
		self.y = int(self.y-10*self.cos)
	def if_collide():
		pass


async def time_loop():
	while True:
		nxt = tornado.gen.sleep(0.05)   # Start the clock.
		await pertime()  # Run while the clock is ticking.
		await nxt

async def pertime():
	for i in range(len(a_tanks)):
			a_tanks[i].move()
			a_apps[i].downmsg()


if __name__ == "__main__":
	app = make_app()
	a_apps = []
	a_onlineusers = []
	a_tanks = []
	a_bullets = []
	app.listen(8888)
	tornado.ioloop.IOLoop.current().spawn_callback(time_loop)
	tornado.ioloop.IOLoop.current().start()
