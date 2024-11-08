import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

export default function Logout() {
    const navigate = useNavigate();

    const onLogoutClick = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Button variant='contained' color='error' onClick={onLogoutClick}>
            Logout
        </Button>
    )
}
