import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from map_matcher import map_match 

app = Flask(__name__, static_folder='../fe/map-matching_for_gps/build', static_url_path='/')
CORS(app)

@app.route('/api/process_csv', methods=['POST'])
def process_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    result = map_match(file)

    return jsonify({'result': result}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
