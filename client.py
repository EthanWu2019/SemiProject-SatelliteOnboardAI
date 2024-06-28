import socket
import os
import sys
import pandas as pd
import logging
import struct


server_ip_port1 = ('172.16.100.104', 12345)
server_ip_port2 = ('172.16.100.13', 12345)
server_dict = {'1' : server_ip_port1,'2' : server_ip_port2}
DIR_BASE = os.path.dirname(os.path.abspath(__file__))
RESULT_FOLDER = os.path.join(DIR_BASE, 'src', 'assets', 'result')

# 设置日志文件路径和日志级别
log_file = os.path.join(DIR_BASE, 'client.log')

# 删除前日志
if os.path.exists(log_file):
    os.remove(log_file)

logging.basicConfig(
    filename=log_file, 
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    filemode='w'  # Open the log file in write mode
)
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

# 构建预设信息
def create_info_excel(ai_mode, excel_path, ai_alg):
    # Create a DataFrame and save it as an Excel file
    df = pd.DataFrame({
        'total_len': ['none'],
        'ai_mode': [ai_mode],
        'test': ['useless'],
        'ai_alg': [ai_alg]
    })
    df.to_excel(excel_path, index=False)

def send_file(filepath, connection):
    file_size = os.path.getsize(filepath)
    logging.info(f'send size: {file_size}')
    file_info = struct.pack('!I', file_size)  # !I 表示大端序无符号整型
    connection.sendall(file_info)
    connection.recv(3)  # 等待服务器确认

    with open(filepath, 'rb') as f:
        data = f.read()
        connection.sendall(data)  # 使用sendall确保所有数据发送完毕
    print(f"File {os.path.basename(filepath)} sent")
    connection.recv(3)

    
def receive_file(c_sock, file_path):
    try:
        logging.info('recv file called')
        file_info = c_sock.recv(4)  # 接收4个字节表示文件大小
        file_len = struct.unpack('!I', file_info)[0]  # !I 表示大端序无符号整型
        logging.info(f'recv len: {file_len}')
        c_sock.send(b'ACK')  # 确认接收文件大小
        logging.info('back signal')

        received_size = 0
        with open(file_path, 'wb') as f:
            while received_size < file_len:
                data = c_sock.recv(1024)
                if not data:
                    break
                f.write(data)
                received_size += len(data)
        logging.info(f"File saved to {file_path}, {received_size}/{file_len}")

        c_sock.send(b'ACK')
    except Exception as e:
        logging.error(e)

def do_client_work(image_path, ai_mode, device, ai_alg):

    server_port = server_dict[device]

    # 创建一个socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 建立连接，参数是一个tuple
    s.connect(server_port)

    # 创建excel
    excel_path = os.path.join(DIR_BASE, 'client_send', 'info.xlsx')
    create_info_excel(ai_mode, excel_path, ai_alg)

    logging.info('-----------开始发送----------')
    # 发送excel
    send_file(excel_path, s)
    logging.info("Sent Excel file done")

    # 发送图片
    send_file(image_path, s)
    logging.info("Sent image file done")

    # 接收图片
    logging.info('-----------开始接收图片----------')
    output_path = os.path.join(RESULT_FOLDER, 'ai_result.jpg')
    logging.info('start to recv jpg:')
    receive_file(s, output_path)
    logging.info(f'Received result jpg file saved at: ai_result.jpg')

    # 接受表格    
    logging.info('-----------开始接收excel----------')
    result_excel_path = os.path.join(RESULT_FOLDER, 'result_ai_info.xlsx')
    receive_file(s, result_excel_path)
    logging.info(f'Received result Excel file saved at: result_ai_info.xlsx')

    s.close()
    return output_path
if __name__ == "__main__":
    image_path = sys.argv[1]
    ai_mode = int(sys.argv[2])
    device_num = str(sys.argv[3])
    ai_alg = int(sys.argv[4])
    print(f'Starting client with image_path: {image_path} and ai_mode: {ai_mode}')
    do_client_work(image_path, ai_mode, device_num, ai_alg)