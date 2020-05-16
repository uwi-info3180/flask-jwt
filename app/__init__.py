from flask import Flask
from app.models import authenticate, identity

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret'

from app import views
