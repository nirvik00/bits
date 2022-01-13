import socket
s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)

localhost = socket.gethostbyname("localhost")

s.bind((localhost, 5500))
s.listen(5)

while True:
    clientsocket, address = s.accept()
    print(f"connection from {address} has been established!")
    clientsocket.send(bytes("welcome to ns server!", "utf-8"))
    clientsocket.close()


