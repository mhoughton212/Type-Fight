import React, {useState, useEffect, useContext, useCallback} from 'react'
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {SocketContext} from '../socket';
import { useNavigate } from "react-router-dom";

function HomePage(props) {
    const [error, setError] = useState('');
    const [joined, setJoined] = useState(false);
    const token = window.localStorage.getItem("token"); 
    let navigate = useNavigate();

    const socket = useContext(SocketContext);

    useEffect(() => {
      if (props.username === undefined || props.email === undefined) {
        setError("Please login to view this page.")
      }
      
      socket.on('join', handleUserJoined);
      socket.on('leave', handleUserLeave);


      return () => {
        // before the component is destroyed
        // unbind all event handlers used in this component
        socket.emit('leave', {room:"1", username: props.username});
        socket.off("join", handleUserJoined);
        socket.off("leave", handleUserLeave);
      };
    }, [props.token]);

    const leaveRoom = () => {
      socket.emit('leave', {room:"1", username: props.username});
      socket.off('join', handleUserJoined)
      socket.off('leave', handleUserLeave)
    }

    const handleUserJoined = useCallback((json) => {
      console.log('user joined!');
     });

    const handleUserLeave = useCallback((json) => {
      console.log('user left');

    });

    const joinRoom = () => {
        socket.emit("join", {
          token: token, 
          room: '1', 
          username: props.username
        }); 

        // navigate('/room/' + json['room']);
      };

    return (
        <div>
            <Collapse in={error !== ""}>
                <Alert
                    severity="error"
                    onClose={() => {
                        setError("");
                    }}
                >
                    {error}
                </Alert>
            </Collapse>
            <Typography component="h4" variant="h4">
                {props.email}
            </Typography>
            <Typography component="h4" variant="h4">
                {props.username}
            </Typography>
            <Typography component="h4" variant="h4">
                Joined: {joined.toString()}
            </Typography>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={ joinRoom }
            >
              Fight Time!
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={ leaveRoom }
            >
              Leave
            </Button>
        </div>  
    );
}

export default HomePage;