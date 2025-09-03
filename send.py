import pyautogui as py

def send(message,times):
	for i in range(1,times):
		py.write(f'abar hobi?,ridi kutta? -{i}',interval=0)
		py.press("enter")

send("Kire kamon lage?",100)

