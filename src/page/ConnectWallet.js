import React, { Fragment, useEffect, useState } from 'react';
import {
    AppBar, Box, Button,
    CircularProgress, Toolbar, Typography
} from '@mui/material';
import axios from 'axios';
import { ethers } from 'ethers';

import Logout from '../auth/Logout';
import { showError } from '../utils/toast';

export default function ConnectWallet() {
    const [account, setAccount] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                setAccount(userAddress);
            } catch (error) {
                showError(`Error connecting to MetaMask, ${error.message}`);
            }
        } else {
            showError('MetaMask is not installed!');
        }
    };

    const disconnectMetaMask = () => {
        setAccount(null);
        window.ethereum && window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };

    const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || null);
    };

    const fetchTokenPrice = async (tokenId) => {
        try {
            const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
            return res.data[tokenId]?.usd || 0;
        } catch (error) {
            showError(`Error fetching token price, ${error.message}`);
            return 0;
        }
    };

    const getTokenData = async (walletAddress) => {
        setLoading(true);
        try {
            const tokenList = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${walletAddress}`);
            const tokenValues = await Promise.all(
                tokenList.data.map(async (token) => {
                    const price = await fetchTokenPrice(token.id);
                    return { ...token, price: price };
                })
            );
            setTokens(tokenValues);
        } catch (error) {
            showError(`Error fetching token data, ${error.message}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (account) {
            getTokenData(account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    return (
        <div>
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
                                account ?
                                    <Button variant='contained' color='warning' onClick={disconnectMetaMask}>
                                        Disconnect MetaMask
                                    </Button>
                                    :
                                    <Button variant='contained' color='success' onClick={connectMetaMask}>
                                        Connect MetaMask
                                    </Button>
                            }
                            <Logout />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Typography variant='h4' component='h4'>
                {account ? `Connected Account: ${account}` : 'Not Connected'}
            </Typography>
            {
                loading ? <CircularProgress />
                    :
                    <Fragment>
                        {tokens.map((token, index) => (
                            <div key={index}>
                                <p>{token.name}: {token.amount} - ${token.price}</p>
                            </div>
                        ))}
                    </Fragment>
            }
        </div>
    );
};
