from app import create_app

"""
File to run the backend app on port 4040
"""
if __name__ == '__main__':
    create_app().run(host='0.0.0.0', port=4040, threaded=True)