from flask import Flask
from flask_jwt import JWT
from app.models import authenticate, identity

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret'

# jwt = JWT(app, authenticate, identity)

from app import views
