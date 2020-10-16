from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
    return 'hello'


@app.route('/fix_schedule/', methods=['POST'])
def fix_schedule():
    return request.data

@app.route('/schedule_errors/',  methods=['POST'])
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
        },
        {
            "code": "AON",
            "day": 12,
            "day_time": "AFTERNOON"
        },
        {
            "code": "WNN",
            "day": 6,
            "required": 10,
            "actual": 9
        },
        {
            "code": "DSS",
            "day": 10,
            "worker": "pielęgniarka 3",
            "preceding": "DN",
            "succeeding": "DN"
        },
        {
            "code": "WUH",
            "hours": 15,
            "worker": "pielęgniarka 7"
        },
        {
            "code": "WOH",
            "hours": 42,
            "worker": "opiekunka 11"
        }
    ])
