import requests

# 示例注册请求
register_request = {
    'username': 'new_user',
    'password': 'new_password'
}
response = requests.post('http://172.16.100.104:5003/api/register', json=register_request)
print('Register response:', response.json())

# 示例登录请求
login_request = {
    'username': 'new_user',
    'password': 'new_password'
}
response = requests.post('http://172.16.100.104:5003/api/login', json=login_request)
print('Login response:', response.json())


