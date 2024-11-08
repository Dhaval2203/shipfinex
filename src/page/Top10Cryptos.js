import React, { useEffect, useState } from 'react';
import {
    Table, TableBody,
    TableContainer, TableHead, TableRow,
    Paper, styled, Card
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import { showError } from '../utils/toast';

export default function Top10Crypto() {
    const [cryptos, setCryptos] = useState([]);

    const fetchCryptos = async () => {
        try {
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/coins/markets',
                {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                    },
                }
            );

            setCryptos(response.data);
        } catch (error) {
            showError(`Error fetching cryptocurrencies:, ${error.message}`);
        }
    };

    useEffect(() => {
        fetchCryptos();
        const interval = setInterval(() => {
            fetchCryptos();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },

        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <Card variant='outlined' style={{ marginTop: '10%' }}>
            <h3>Top 10 Cryptocurrencies</h3>
            <TableContainer component={Paper} style={{ width: '50' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Rank</StyledTableCell>
                            <StyledTableCell align='center'>Logo</StyledTableCell>
                            <StyledTableCell align='center'>Name</StyledTableCell>
                            <StyledTableCell align='center'>Price (USD)</StyledTableCell>
                            <StyledTableCell align='center'>Market Cap (USD)</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cryptos.map((crypto, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell align='center'>{index + 1}</StyledTableCell>
                                <StyledTableCell align='center'>
                                    <img alt='Not Found' src={crypto.image} style={{ height: '15%', width: '15%' }} />
                                </StyledTableCell>
                                <StyledTableCell align='center'>{crypto.name} ({crypto.symbol})</StyledTableCell>
                                <StyledTableCell align='center'>${crypto?.current_price?.toLocaleString()}</StyledTableCell>
                                <StyledTableCell align='center'>${crypto?.market_cap?.toLocaleString()}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}
