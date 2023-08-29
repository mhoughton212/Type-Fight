import React, {useState, useEffect} from 'react'
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

function HomePage(props) {
    const [error, setError] = useState('');

    useEffect(() => {
      if (props.username === undefined || props.email === undefined) {
        setError("Please login to view this page.")
      }
    }, [props.token]);

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
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Fight Time!
            </Button>
        </div>  
    );
}

export default HomePage;