
import requests

SERVER_URL = 'http://127.0.0.1:8888/home'
def sendmsg():
	data = {}
	data['cmd'] = 'fire'
	data['act'] = 10

	requests.post(SERVER_URL,data)


if __name__ == '__main__':
	sendmsg()