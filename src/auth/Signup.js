import React, { useState } from 'react';
import {
    TextField, Button, Box,
    Typography, Paper, Link,
    Container, Checkbox, FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { showError, showSuccess } from '../utils/toast';
import { checkPasswordStrength } from '../utils/utils';
import DisplayPasswordStrength from '../component/DisplayPasswordStrength';

export default function Signup() {
    const initFormData = {
        email: '',
        password: ''
    };
    const [formData, setFormData] = useState(initFormData);
    const [passwordStrength, setPasswordStrength] = useState('Weak');
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);

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

    const handleSignup = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        if (formData.email && formData.password) {
            const oldRegisteduser = JSON.parse(localStorage.getItem('investor'));

            oldRegisteduser && oldRegisteduser.length ?
                localStorage.setItem('investor', JSON.stringify([...oldRegisteduser, formData]))
                :
                localStorage.setItem('investor', JSON.stringify([formData]));

            showSuccess('Signup successful');
            navigate('/login')
        } else {
            showError('Please fill in all fields');
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
        validate()
    };

    return (
        <Container maxWidth='sm'>
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant='h4' component='h1' gutterBottom align='center'>
                    Signup
                </Typography>

                <Box component='form' sx={{ mt: 2 }}>
                    <TextField
                        label='Email'
                        fullWidth
                        margin='normal'
                        id='email'
                        value={formData.email}
                        onChange={(e) => onValueChange(e)}
                        helperText={errors.email}
                        required
                    />

                    <TextField
                        label='Password'
                        type='password'
                        fullWidth
                        margin='normal'
                        id='password'
                        value={formData.password}
                        onChange={(e) => onValueChange(e)}
                        helperText={errors.password}
                        required
                    />

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

                    <Button variant='contained' fullWidth onClick={handleSignup} sx={{ mt: 2 }}>
                        Signup
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant='body2'>
                            Already have an account?{' '}
                            <Link href='/login' underline='hover'>
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
