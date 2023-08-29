from flask import Blueprint, render_template, request, jsonify, url_for
from . import guard, db, cors, User
import flask_praetorian
import flask_cors
from .token import generate_confirmation_token, confirm_token
from .email import send_email
import datetime

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    req = request.get_json(force=True)
    email = req.get("email", None)
    password = req.get("password", None)

    user = User.query.filter_by(email=email).first()
    if user is None:
        return {}, 401

    if not user.confirmed:
        return {"error": "Please verify your email address"}, 401

    user = guard.authenticate(email, password)
    ret = {"access_token": guard.encode_jwt_token(user)}
    return ret, 200


@auth.route("/sign-up", methods=["GET", "POST"])
def sign_up():
    req = request.get_json(force=True)
    username = req.get("username", None)
    email = req.get("email", None)
    password1 = req.get("password1", None)
    password2 = req.get("password2", None)

    email_exists = User.query.filter_by(email=email).first() is not None
    username_exists = User.query.filter_by(username=username).first() is not None

    if email_exists:
        return {"error": "Email is already in use."}, 400

    if username_exists:
        return {"error": "Username is taken, please try another."}, 400

    if password1 != password2:
        return {"error": "Passwords do not match"}, 400

    user = User(
        username=username,
        email=email,
        password=guard.hash_password(password1),
        confirmed=False,
    )
    db.session.add(user)
    db.session.commit()

    token = generate_confirmation_token(user.email)
    confirm_url = "http://localhost:3000/confirm-email/" + token
    html = render_template("email.html", confirm_url=confirm_url)
    subject = "Please confirm your email for Type Fight"
    send_email(user.email, subject, html)
    # user = guard.authenticate(email, password1)
    # ret = {"access_token": guard.encode_jwt_token(user)}
    return {"data": "Verification link sent. Please verify your email."}, 201


@auth.route("/sign-out", methods=["GET"])
def sign_out():
    return jsonify({"data": "sign out"})


@auth.route("/refresh", methods=["POST"])
def refresh():
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {"access_token": new_token}
    return ret, 200


@auth.route("/confirm-email/<token>")
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return {"error": "The confirmation link is invalid or has expired."}, 401

    user = User.query.filter_by(email=email).first_or_404()
    if user.confirmed:
        return {"data": "User already confirmed"}, 200

    user.confirmed = True
    user.confirmed_on = datetime.datetime.now()
    db.session.add(user)
    db.session.commit()
    return {"data": "You have confirmed your account. Thanks!"}, 200


@auth.route("/validate-token")
@flask_praetorian.auth_required
def validate_token():
    return {"loggedIn": True}, 200
