import socket
import os
import sys
import pandas as pd

server_ip_port = ('127.0.0.1', 12345)
DIR_BASE = os.path.dirname(os.path.abspath(__file__))
RESULT_FOLDER = os.path.join(DIR_BASE, 'src', 'assets', 'result')

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

def create_info_excel(raw_file_len, ai_mode, excel_path):
    # Create a DataFrame and save it as an Excel file
    df = pd.DataFrame({
        'total_len': [raw_file_len],
        'ai_mode': [ai_mode],
        'test': ['useless']
    })
    df.to_excel(excel_path, index=False)

def send_excel(sock, excel_path):
    with open(excel_path, 'rb') as excel_file:
        while True:
            data = excel_file.read(1024)
            if not data:
                break
            sock.send(data)    
    sock.send(b'DONE')
    print("Sent DONE signal")

# 发送原始文件长度和ai模式给服务端
# def send_pre_info(sock, raw_file_len, ai_mode):
#     blen = raw_file_len.to_bytes(4, byteorder='big', signed=False)
#     info = bytearray(blen)
#     info.append(ai_mode)
#     b = bytes(info)
#     sock.send(b)

def do_client_work(image_path, ai_mode,):
    print(f'Starting client work with image_path: {image_path} and ai_mode: {ai_mode}')
    # 创建一个socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 建立连接，参数是一个tuple
    s.connect(server_ip_port)
    print(f'Connected to server at {server_ip_port}')

    # 发送数据
    with open(image_path, "rb") as trans_f:
        # 发送4字节文件长度信息和1字节ai模式
        trans_f.seek(0, 2)
        total_len = trans_f.tell()
        len_byte = total_len.to_bytes(4, byteorder='big', signed=False)
        trans_f.seek(0, 0)

        # send_pre_info(s, total_len, ai_mode)
        # print(f'Sent pre info with total_len: {total_len} and ai_mode: {ai_mode}')

        excel_path = os.path.join(DIR_BASE, 'client_send', 'info.xlsx')
        create_info_excel(total_len, ai_mode, excel_path)
        send_excel(s, excel_path)
        print(f'Sent Excel file with total_len: {total_len} and ai_mode: {ai_mode}')
        
        # 发送文件内容
        slen = 0
        while True:
            try:
                data_frm = trans_f.read(1024)
                slen += len(data_frm)
                if len(data_frm) == 0:
                    print("send over, slen:{}".format(slen))
                    break
                s.send(data_frm)
            except Exception as e:
                print(f'Error while sending data: {repr(e)}')
                continue

    # 接收数据
    rlen = 0
    total_len_bytes = s.recv(4)
    total_len = int.from_bytes(total_len_bytes, byteorder='big', signed=False)
    print(f'Expecting to receive total_len: {total_len}')

    output_path = os.path.join(RESULT_FOLDER, 'ai_result.jpg')
    with open(output_path, 'w+b') as rcvf:
        while rlen < total_len:
            try:
                d = s.recv(1024)
                rlen += len(d)
                rcvf.write(d)
            except Exception as e:
                print(f'Error while receiving data: {repr(e)}')
                continue

    s.close()
    print(f'Received file saved at: {output_path}')
    return output_path

if __name__ == "__main__":
    image_path = sys.argv[1]
    ai_mode = int(sys.argv[2])
    print(f'Starting client with image_path: {image_path} and ai_mode: {ai_mode}')
    do_client_work(image_path, ai_mode)