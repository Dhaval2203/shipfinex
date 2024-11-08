import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Box,
    Typography, Paper, Container,
    Checkbox, FormControlLabel, Link
} from '@mui/material';

import { showError, showSuccess } from '../utils/toast';
import DisplayPasswordStrength from '../component/DisplayPasswordStrength';
import { checkPasswordStrength } from '../utils/utils';

export default function Login() {
    const initFormData = {
        email: '',
        password: ''
    };
    const [formData, setFormData] = useState(initFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('Weak');

    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validate = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }
        return errors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const oldRegisteduser = JSON.parse(localStorage.getItem('investor'))
        const user = oldRegisteduser.find(user => user.email === formData.email && user.password === formData.password);

        if (user) {
            localStorage.setItem('token', JSON.stringify(formData));
            showSuccess('Signup successful');
            navigate('/dashboard');
        } else {
            showError('Invalid username or password');
        }
    };

    const onValueChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        if (e.target.id === 'password') {
            setPasswordStrength(checkPasswordStrength(e.target.value));
        }
        validate();
    };

    return (
        <Container maxWidth='sm'>
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant='h4' component='h1' gutterBottom align='center'>
                    Login
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label='Email'
                        variant='outlined'
                        fullWidth
                        id='email'
                        value={formData.email}
                        onChange={(e) => onValueChange(e)}
                        required
                        helperText={errors.email}
                    />
                </Box>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label='Password'
                        variant='outlined'
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        fullWidth
                        value={formData.password}
                        onChange={(e) => onValueChange(e)}
                        required
                        helperText={errors.password}
                    />
                </Box>
                <DisplayPasswordStrength passwordStrength={passwordStrength} />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showPassword}
                            onChange={toggleShowPassword}
                            color='primary'
                        />
                    }
                    label='Show Password'
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Button variant='contained' color='primary' type='submit' fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant='body2'>
                        Don't have an account?{' '}
                        <Link href='/signup' underline='hover'>
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
