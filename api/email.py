from flask_mail import Message

from config import BaseConfig
from . import mail


def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
        sender=BaseConfig.MAIL_DEFAULT_SENDER,
    )
    mail.send(msg)
