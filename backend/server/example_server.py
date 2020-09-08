from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'hello'

@app.route('/fix_schedule/',  methods = ['POST'])
def hello_world():
    return 'Backend works!'
