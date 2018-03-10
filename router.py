import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='idb/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
	if(path == ""):
		return send_from_directory('idb/build', 'index.html')
	else:
		if(os.path.exists("idb/build/" + path)):
			return send_from_directory('idb/build', path)
		else:
			return send_from_directory('idb/build', 'index.html')


if __name__ == '__main__':
	app.run(use_reloader=True, port=5000, threaded=True)
