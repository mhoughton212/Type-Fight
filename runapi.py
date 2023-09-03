from api import create_app
from api.token import confirm_token
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from flask import session

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")
next_room = "1"
in_room = 0


@socketio.on("join")
def on_join(data):
    print(data)
    username = data["username"]
    room = data["room"]
    join_room(room)
    socketio.emit("join", to=room)


@socketio.on("leave")
def on_leave(data):
    username = data["username"]
    room = data["room"]
    socketio.emit("leave", to=room)
    leave_room(room)


if __name__ == "__main__":
    socketio.run(app, debug=True)
