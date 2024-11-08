import React, { Fragment } from 'react';
import { Grid } from '@mui/material';

import ConnectWallet from './ConnectWallet';
import Top10Crypto from './Top10Cryptos';
import Graph from './Graph';

export default function Dashboard() {
    return (
        <Fragment>
            <ConnectWallet />

            <Grid container>
                <Grid item xs={0.5} />
                <Grid item xs={5.25}>
                    <Top10Crypto />
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={5.25}>
                    <Graph />
                </Grid>
                <Grid item xs={0.5} />
            </Grid>
        </Fragment>
    );
}
