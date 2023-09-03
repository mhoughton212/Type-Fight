import React, {useState, useEffect, useContext, useCallback} from 'react'
import { useParams } from 'react-router-dom';
import {SocketContext} from '../socket';

export default function Room(props) {
    const [error, setError] = useState("");
    const { roomCode } = useParams();
    const socket = useContext(SocketContext);

    useEffect(() => {
    }, []);

    

    return (
        <div>
            {roomCode}
        </div>
    );
}