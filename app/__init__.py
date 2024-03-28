from flask import Flask
# from app.models import authenticate, identity
from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

from app import views
