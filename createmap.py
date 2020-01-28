import json
import os

def main():
	ifhave=os.path.exists('maps.txt')
	if not ifhave:
		with open('maps.txt','w') as f:
			f.close()
			data = ''
	else:
		with open('maps.txt','r') as f:
			file = f.read()
			data = json.loads(file)

			f.close()


	a = []
	a.append([100,200,0,200,20,0])
	a.append([300,500,90,200,20,0])
	a.append([800,100,180,600,20,0])
	a.append([100,400,270,300,20,0])
	a.append([1200,600,0,100,20,0])
	a.append([1800,700,180,200,20,0])
	a.append([1300,600,90,500,20,0])
	a.append([1500,300,0,200,20,0])
	a.append([713,340,0,680,1425,1])

	#x,y,facing,l,w


	with open('maps.txt','w') as f:
		
		indata = json.dumps(a)
		f.write(indata)
		f.close()


if __name__ == '__main__':
	main()