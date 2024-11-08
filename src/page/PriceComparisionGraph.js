import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, LineElement, PointElement,
    CategoryScale, LinearScale, Title,
    Tooltip, Legend
} from 'chart.js';
import { Card, CircularProgress } from '@mui/material';

import { showError } from '../utils/toast';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function PriceComparisionGraph() {
    const [chartData, setChartData] = useState(null);
    const API_KEY = '55defdd895f2a08b209f05464f34dafdbc6507c3d9c564cbb0f3c30c45b97af4';

    useEffect(() => {
        const fetchData = async () => {
            const historicalData = await fetchHistoricalData();
            const data = prepareChartData(historicalData);
            setChartData(data);
        };
        fetchData();
    }, []);

    const fetchHistoricalData = async () => {
        try {
            // Fetch top 10 cryptocurrencies by market cap
            const top10Response = await axios.get(
                `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=${API_KEY}`
            );
            const top10Cryptos = top10Response.data.Data;

            const historicalDataPromises = top10Cryptos.map(async (crypto) => {
                const symbol = crypto.CoinInfo.Name;
                const historyResponse = await axios.get(
                    `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=30&api_key=${API_KEY}`
                );
                return {
                    name: crypto.CoinInfo.FullName,
                    symbol,
                    data: historyResponse.data.Data,
                };
            });

            const historicalData = await Promise.all(historicalDataPromises);
            return historicalData;
        } catch (error) {
            showError(`Error fetching data:, ${error}`);
            return [];
        }
    };

    const prepareChartData = (historicalData) => {
        const labels = historicalData[0]?.data?.Data?.map((point) =>
            new Date(point.time * 1000).toLocaleDateString()
        );

        const datasets = historicalData?.map((crypto) => ({
            label: crypto.name,
            data: crypto.data.Data.map((point) => point.close),
            fill: false,
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
            tension: 0.1,
        }));

        return { labels, datasets };
    };

    return (
        <Card variant='outlined' style={{ marginTop: '10%' }}>
            <h2>Top 10 Cryptocurrency Price Movements (Last 30 Days)</h2>
            {chartData ?
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Price Movements of Top 10 Cryptocurrencies' },
                        },
                        scales: {
                            x: { title: { display: true, text: 'Date' } },
                            y: {
                                title: { display: true, text: 'Price (USD)' },
                                ticks: {
                                    callback: (value) => `$${value.toLocaleString()}`,
                                },
                            },
                        },
                    }}
                />
                :
                <CircularProgress />
            }
        </Card>
    );
};
