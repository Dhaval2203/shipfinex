import React, { Fragment } from 'react';
import { Grid } from '@mui/material';

import ConnectWallet from './ConnectWallet';
import Top10Crypto from './Top10Cryptos';
import PriceComparisionGraph from './PriceComparisionGraph';


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
                    <PriceComparisionGraph />
                </Grid>
                <Grid item xs={0.5} />
            </Grid>
        </Fragment>
    );
}
