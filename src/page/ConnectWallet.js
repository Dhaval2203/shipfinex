import React, { useState } from 'react';
import {
    Button, Typography, Container,
    Card, CardContent, CircularProgress,
    Box, AppBar, Toolbar
} from '@mui/material';
import axios from 'axios';

import Logout from '../auth/Logout';
import { showError, showInfo } from '../utils/toast';

export default function ConnectWallet() {
    const [walletAddress, setWalletAddress] = useState('');
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);

    const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImIxYzRlZDVjLTJkMzAtNDQ3Ni05M2NkLWE0MjNkMzlkNTliMSIsIm9yZ0lkIjoiNDE1MjcwIiwidXNlcklkIjoiNDI2NzY5IiwidHlwZUlkIjoiMWQ0ZDUxMmMtYmRjYS00NTE5LTkwNTUtOTFiZTI0YTliNzJhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzA5ODY5NTUsImV4cCI6NDg4Njc0Njk1NX0.K6jLsFfjCCRJGyTuPRXZW5f_l_D5jsjkVLDvIT67xRE'
    const SUPPORTED_CHAINS = ['eth', 'bsc', 'polygon', 'avalanche'];

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(address);
                fetchBalances(address);
            } catch (err) {
                showError(`Error connecting wallet:, ${err}`);
            }
        } else {
            showError('Please install MetaMask!');
        }
    };

    const fetchBalances = async (address) => {
        setLoading(true);
        try {
            const allBalances = await Promise.all(
                SUPPORTED_CHAINS.map(async (chain) => {
                    const response = await axios.get(
                        `https://deep-index.moralis.io/api/v2/${address}/erc20`,
                        {
                            headers: { 'X-API-Key': MORALIS_API_KEY },
                            params: { chain },
                        }
                    );

                    return response.data.map((token) => ({
                        ...token,
                        chain,
                        usdValue: token.usd || 0,
                    }));
                })
            );

            const flatBalances = allBalances.flat().filter((token) => parseFloat(token.balance) > 0);
            if (!flatBalances.length) { showInfo('You have no coin') }
            setBalances(flatBalances);
        } catch (err) {
            showError(`Error fetching balances:, ${err}`);
        }
        setLoading(false);
    };

    const disconnectMetaMask = () => {
        setWalletAddress(null);
        window.ethereum && window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };

    const handleAccountsChanged = (accounts) => {
        setWalletAddress(accounts[0] || null);
    };

    return (
        <Container maxWidth='sm'>
            <Typography variant='h4' align='center' gutterBottom>
                Wallet Dashboard
            </Typography>
            <Box sx={{ display: 'flex', marginBottom: '5%' }}>
                <AppBar component='nav'>
                    <Toolbar>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        />
                        <Box display={'flex'} gap={2}>
                            {
                                walletAddress ?
                                    <Button variant='contained' color='warning' onClick={disconnectMetaMask}>
                                        Disconnect MetaMask
                                    </Button>
                                    :
                                    <Button variant='contained' color='success' onClick={connectWallet}>
                                        Connect MetaMask
                                    </Button>
                            }
                            <Logout />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Typography variant='h4' component='h4'>
                {walletAddress ? `Connected Account: ${walletAddress}` : 'Not Connected'}
            </Typography>

            {loading ?
                <CircularProgress />
                : (
                    balances.map((token, index) => (
                        <Card key={index} variant='outlined' style={{ marginTop: '10px' }}>
                            <CardContent>
                                <Typography variant='h6'>{token.name} ({token.symbol})</Typography>
                                <Typography>Chain: {token.chain.toUpperCase()}</Typography>
                                <Typography>Balance: {parseFloat(token.balance) / (10 ** token.decimals)}</Typography>
                                <Typography>Value (USD): ${token.usdValue.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
        </Container>
    );
};
