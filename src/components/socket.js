import React from 'react'
import socketio from "socket.io-client";

export const socket = socketio.connect("http://" + document.domain + ":5000");
export const SocketContext = React.createContext();