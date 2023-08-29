from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_praetorian import Praetorian
from flask_cors import CORS
import datetime
from flask_mail import Mail

DB_NAME = "database.db"

db = SQLAlchemy()
guard = Praetorian()
cors = CORS()
mail = None


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default="true")
    registered_on = db.Column(db.DateTime, server_default=db.func.now())
    admin = db.Column(db.Boolean, nullable=False, default=False)
    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.DateTime, nullable=True)

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @classmethod
    def lookup(cls, email):
        return cls.query.filter_by(email=email).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


def create_app():
    global mail
    app = Flask(__name__)
    app.config.from_object("config.BaseConfig")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"

    guard.init_app(app, User)
    db.init_app(app)
    cors.init_app(app)
    mail = Mail(app)

    with app.app_context():
        db.create_all()

    from api.auth import auth
    from .views import views

    app.register_blueprint(auth)
    app.register_blueprint(views)

    with app.app_context():
        db.create_all()
        if db.session.query(User).filter_by(email="EB@gmail.com").count() < 1:
            db.session.add(
                User(
                    email="EB@gmail.com",
                    username="EB",
                    password=guard.hash_password("yobama"),
                    roles="admin",
                    confirmed=True,
                    confirmed_on=datetime.datetime.now(),
                )
            )
        db.session.commit()

    return app
