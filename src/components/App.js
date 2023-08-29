import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Auth/login.js'
import Signup from './Auth/sign-up.js'
import PasswordReset from './Auth/passwordReset.js'
import HomePage from './main-ui/HomePage.js'
import ConfirmEmail from './Auth/ConfirmEmail.js';
import Signout from './Auth/Signout.js'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';
import { IconButton } from '@mui/material';
import { ClassNames } from '@emotion/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (token !== "") window.localStorage.setItem("token", token);
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    
    const options = {
      method: "GET",
      headers: {"Authorization": "Bearer " + token},
  };
    fetch("/validate-token", options)
    .then((response) => response.json())
    .then((data) => {
      if ('loggedIn' in data) {
        setLoggedIn(true);
        getUserData();
      }
      else {setLoggedIn(false)}
    });
  }, [token])

  const getUserData = () => {
      const token = window.localStorage.getItem('token');
        const requestOptions = {
            method: "GET",
            headers: {"Authorization": "Bearer " + token},
        };
        fetch('/get-user-data', requestOptions)
        .then((response) => {
            if (response.ok) return response.json();
            else throw new Error("Please login to view this page");
        })
        .then((data) => {
            if ("data" in data) {
                if ('email' in data.data) setEmail(data.data.email);
                if ('username' in data.data) setUsername(data.data.username);
            }
            else if ('error' in data) setError(data.error);
        })
        .catch((error) => {
            setError(error.message);
        });
  }

  const renderRouter = () => {
    return (
      <Routes>
        <Route 
          path="/" 
          element={<HomePage email={email} username={username}/>}
        />
        <Route 
          path="/login"
          element={<Login setToken={setToken} />}
        />
        <Route 
          path="/signup"
          element={<Signup setToken={setToken} />}
        />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/signout" element={<Signout />} />
        <Route 
          path="/confirm-email/:token"
          element={<ConfirmEmail setToken={setToken} />}
        />
      </Routes>
    );
  }

  return (
    <div>
      <BrowserRouter>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Type Fight!
          </Typography>
          <Link href="/">
            <Button color="inherit">Home</Button>
          </Link>
          {loggedIn ? (
            <div>
            <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button 
                variant="contained" 
                color='primary'
                size='small'
                startIcon={<PersonIcon />}
                {...bindTrigger(popupState)}>
                  {username}
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={popupState.close}>Profile</MenuItem>
                  <MenuItem onClick={popupState.close}>My account</MenuItem>
                  <MenuItem onClick={popupState.close}>Logout</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          </div>
          ) : (
          <Link href="/login">
            <Button color="inherit">Login</Button>
          </Link>
          )}
          
        </Toolbar>
      </AppBar>
    </Box>
      {renderRouter()}
      </BrowserRouter>
    </div>
  );
}

export default App