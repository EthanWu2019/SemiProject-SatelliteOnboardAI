import os
import subprocess
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename

DIR_BASE = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(DIR_BASE, 'uploads')
RESULT_FOLDER = os.path.join(DIR_BASE, 'src', 'assets', 'result')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

@app.route('/api/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        algorithm = int(request.form['algorithm'])

        try:
            result = subprocess.run(['python', 'client.py', filepath, str(algorithm)], capture_output=True)
            if result.returncode == 0:
                output_image_path = os.path.join(RESULT_FOLDER, 'ai_result.jpg')
                return send_file(output_image_path, mimetype='image/jpeg')
            else:
                return jsonify({'success': False, 'error': result.stderr.decode('utf-8')})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
