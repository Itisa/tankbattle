import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import random
import math

# class MainHandler(tornado.web.RequestHandler):
#     def get(self):
#         self.write("Hello, 1world")

	# def post(self):
	# 	self.get()
class EchoWebSocket(tornado.websocket.WebSocketHandler):

	
	def check_origin(self,origin):
		return True

	def open(self):
		print("WebSocket opened")
		while 1:
			userid = random.randint(1,100000)
			if userid in a_onlineusers:
				continue
			break
		a_onlineusers.append(userid)

		cmsg = self.pack('connected','')
		self.write_message(cmsg)
		
		nt = Tank(userid)
		a_tanks.append(nt)
		jsnt = self.pack('init_user',nt.data)
		self.write_message(jsnt)

	def on_message(self, message):
		# print('message',message)
		msg = json.loads(message)
		# print(msg,'#'*20)
		
		act = msg['action']
		data = msg['data']
		nt = a_tanks[0]
		if act == 'new_tank_come':
			pass
		
		elif act == 'keydown':
			if data =='w':
				nt.if_w = True
				print('#'*40)
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
		elif act == 'move':
			jsnt = self.pack('move_tank',a_tanks[0].data)
			self.write_message(jsnt)
			a_tanks[0].move()


	def on_close(self):
		print("WebSocket closed")

	def pack(self,action,data):
		dmsg = {}
		dmsg['action'] = action
		if data != '':
			dmsg['data'] = data
		jsmsg = json.dumps(dmsg)
		return jsmsg

	def move(self):
		nt.move()

def make_app():
	return tornado.web.Application([
		(r"/", EchoWebSocket),
	])

class Tank():
	def __init__(self,userid):
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
		self.data = {}
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['userid'] = self.userid
	
	def move(self):
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
		self.data['x'] = self.x
		self.data['y'] = self.y
		self.data['facing'] = self.facing
		self.data['sin'] = self.sin
		self.data['cos'] = self.cos
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
		self.x = self.x+10*self.sin
		self.y = self.y-10*self.cos
	def if_collide():
		pass
		
		

if __name__ == "__main__":
	app = make_app()
	a_onlineusers = []
	a_tanks = []
	a_bullets = []
	app.listen(8888)
	tornado.ioloop.IOLoop.current().start()