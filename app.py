import os
import subprocess
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from PIL import Image
import pandas as pd  
import uuid

DIR_BASE = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(DIR_BASE, 'uploads')
RESULT_FOLDER = os.path.join(DIR_BASE, 'src', 'assets', 'result')
LOG_FOLDER = os.path.join(DIR_BASE, 'logs')
SAVE_TIFF_PATH = os.path.join(DIR_BASE, 'client_send')

if not os.path.exists(SAVE_TIFF_PATH):
    os.makedirs(SAVE_TIFF_PATH)

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

class FileRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), unique=True, nullable=False)
    upload_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())


@app.route('/api/convert', methods=['POST'])
def convert_image():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    try:
        print(file)
        img = Image.open(file.stream)
        img = img.convert('RGB')

        unique_filename = str(uuid.uuid4()) + '.jpg'
        file_path = os.path.join(SAVE_TIFF_PATH, unique_filename)

        img.save(file_path, 'JPEG', quality=95)

        return send_file(file_path, mimetype='image/jpeg')
    except Exception as e:
        return str(e), 500

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
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        print(f'File saved at {filepath}')

        new_file = FileRecord(filename=unique_filename)
        db.session.add(new_file)
        db.session.commit()

        mode = int(request.form['mode'])
        algorithm = int(request.form['algorithm'])
        device = int(request.form['device'])
        print(f'Algorithm selected: {algorithm}')

        log_file_path = os.path.join(LOG_FOLDER, f'{unique_filename}.log')

        client_script = os.path.join(DIR_BASE, 'client.py')
        
        print(f'Client script path: {client_script}')
        print(f'Client script exists: {os.path.exists(client_script)}')

        try:
            file_length = os.path.getsize(filepath)
            print(file_length)
            print(f'Running client.py with arguments: {filepath} {mode} {device} {algorithm}')
            with open(log_file_path, 'w') as log_file:
                result = subprocess.run(['python', client_script, filepath, str(mode), str(device), str(algorithm)], stdout=log_file, stderr=subprocess.STDOUT)
            
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
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5002)
