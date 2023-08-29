import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Typefight
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function ConfirmEmail(props) {
  const { token } = useParams();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("/confirm-email/" + token)
    .then((response) => response.json())
    .then((data) => {
        if ("error" in data) {
            setError(data['error']);
            return;
        }
        if ("data" in data) setSuccess(data['data']);
        
        setConfirmed(true);
    });
  }, [token]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Collapse in={error != ""}>
            <Alert
            severity="error"
            onClose={() => {
                setError("");
            }}
            >
                {error}
            </Alert>
          </Collapse>
          <Collapse in={success != ""}>
            <Alert
            severity="success"
            onClose={() => {
                setSuccess("");
            }}
            >
                {success}
            </Alert>
          </Collapse>

        {confirmed ? (
            <div>
                <Typography variant='body2' component='p'>
                    Thanks for confirming your email! Please login.
                </Typography>
                <Link href="/login" variant="body2">
                    <Button>Login</Button>
                </Link>
            </div>
            ) : null}
      </Container>
    </ThemeProvider>
  );
}