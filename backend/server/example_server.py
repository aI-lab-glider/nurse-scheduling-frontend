from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'hello'

@app.route('/schedule_errors/',  methods = ['POST'])
def hello_world():
    return jsonify([
    {
      "code": "WND",
      "day": 7,
      "required": 4,
      "actual": 3
    },
    {
      "code": "LLB",
      "worker": "opiekunka 1",
      "week": 1
    },
    {
      "code": "WND",
      "day": 7,
      "required": 5,
      "actual": 3
    },
    {
      "code": "LLB",
      "worker": "opiekunka 1",
      "week": 2
    }
])
