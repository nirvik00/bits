import socket
s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)

localhost = socket.gethostbyname("localhost")
s.connect((localhost, 5500))

full_msg=""
while True:
    msg=s.recv(8)
    if len(msg) <= 0:
        break
    print(msg)
    full_msg += msg.decode("utf-8")

print(full_msg)


