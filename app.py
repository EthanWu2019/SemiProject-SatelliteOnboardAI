import os
import subprocess
from flask import Flask, request, jsonify, send_file, render_template_string
from werkzeug.utils import secure_filename
from flask_cors import CORS  # 导入 Flask-CORS
from flask_sqlalchemy import SQLAlchemy  # 导入 SQLAlchemy
import pandas as pd  
import uuid

DIR_BASE = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(DIR_BASE, 'uploads')
RESULT_FOLDER = os.path.join(DIR_BASE, 'src', 'assets', 'result')
LOG_FOLDER = os.path.join(DIR_BASE, 'logs')  # 添加日志文件夹

app = Flask(__name__)
CORS(app)  # 启用 CORS
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# SQLite database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

if not os.path.exists(LOG_FOLDER):  # 创建日志文件夹
    os.makedirs(LOG_FOLDER)

# Example model for the database
class FileRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), unique=True, nullable=False)
    upload_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

@app.route('/')
def index():
    files = FileRecord.query.all()
    return render_template_string("""
        <h1>Uploaded Files</h1>
        <ul>
        {% for file in files %}
            <li>{{ file.filename }}</li>
        {% endfor %}
        </ul>
    """, files=files)

@app.route('/api/process_image', methods=['POST'])
def process_image():
    print('Received a request to process an image')
    if 'image' not in request.files:
        print('No image part in the request')
        return jsonify({'error': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        print('No selected file in the request')
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Generate a unique filename
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        print(f'File saved at {filepath}')

        # Save file record to the database
        new_file = FileRecord(filename=unique_filename)
        db.session.add(new_file)
        db.session.commit()

        algorithm = int(request.form['algorithm'])
        print(f'Algorithm selected: {algorithm}')

        log_file_path = os.path.join(LOG_FOLDER, f'{unique_filename}.log')  # 定义日志文件路径

        try:
            print(f'Running client.py with arguments: {filepath} {algorithm}')
            with open(log_file_path, 'w') as log_file:
                result = subprocess.run([r'D:\intern\Ai_Platform-main\Ai_Platform-main\.venv\Scripts\python.exe', 'client.py', filepath, str(algorithm)], stdout=log_file, stderr=subprocess.STDOUT)
            
            if result.returncode == 0:
                output_image_path = os.path.join(RESULT_FOLDER, 'ai_result.jpg')
                print(f'Processing succeeded, output image path: {output_image_path}')
                if os.path.exists(output_image_path):
                    return send_file(output_image_path, mimetype='image/jpeg')
                else:
                    print('Output image not found')
                    return jsonify({'success': False, 'error': 'Output image not found'})
            else:
                with open(log_file_path, 'r') as log_file:
                    error_log = log_file.read()
                print(f'Processing failed with error: {error_log}')
                return jsonify({'success': False, 'error': error_log})
        except Exception as e:
            print(f'Exception occurred: {str(e)}')
            return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print('Starting Flask server...')
    # Create the database and the tables
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5002)
