import React, { Fragment } from 'react';
import { LinearProgress, Typography } from '@mui/material';

export default function DisplayPasswordStrength(props) {
    const { passwordStrength } = props;

    return (
        <Fragment>
            <LinearProgress
                variant='determinate'
                value={(passwordStrength / 4) * 100}
                sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: passwordStrength === 'Strong' ? 'green' : passwordStrength === 'Moderate' ? 'orange' : 'red',
                    },
                }}
            />
            <Typography variant='body2' sx={{ mt: 1, color: passwordStrength === 'Strong' ? 'green' : passwordStrength === 'Moderate' ? 'orange' : 'red' }}>
                {passwordStrength}
            </Typography>
        </Fragment>
    )
}
