from flask import Flask, render_template, jsonify, url_for

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    app.run(debug=True)
    url_for('static', filename='VotacionesSenado2017.json')
