import os


class BaseConfig(object):
    """Base configuration."""

    # main config
    SECRET_KEY = "my_precious"
    SECURITY_PASSWORD_SALT = "my_precious_two"
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 13
    WTF_CSRF_ENABLED = True
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    # mail settings
    MAIL_SERVER = "smtp.googlemail.com"
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # gmail authentication
    MAIL_USERNAME = "brofessor212@gmail.com"
    MAIL_PASSWORD = "huguexsbvitwciqz"

    # mail accounts
    MAIL_DEFAULT_SENDER = "brofessor212@gmail.com"

    JWT_ACCESS_LIFESPAN = {"hours": 24}
    JWT_REFRESH_LIFESPAN = {"days": 30}
    SECRUITY_PASSWORD_SALT = "ballsack69yuh"
