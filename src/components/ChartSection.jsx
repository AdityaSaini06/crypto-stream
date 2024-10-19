import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import { motion } from 'framer-motion';

const ChartSection = ({
    id, priceChange24h, marketCap, totalVolume, circulatingSupply, twitterFollowers
}) => {
    // State for price, market cap, and volume data
    const [priceData, setPriceData] = useState({
        options: {
            chart: { id: 'area-datetime' },
            grid: { show: false },
            title: { text: "Market Price (USD)", style: { fontSize: '14px', fontWeight: 'bold', color: "#fcdf03" } },
            stroke: { curve: 'smooth' },
            xaxis: { type: "datetime" },
            dataLabels: { enabled: false },
            yaxis: { show: false },
            colors: ["#fcdf03"],
            tooltip: { y: { formatter: value => value.toFixed(2) }, theme: "dark" },
            selection: 365
        },
        series: [{ name: 'Market Price', data: [[1645837250522, 39804.53]] }]
    });

    const [marketCapData, setMarketCapData] = useState({
        options: {
            chart: { id: 'market-cap-line' },
            grid: { show: false },
            title: { text: "Market Cap (USD)", style: { fontSize: '14px', fontWeight: 'bold', color: '#ff69f5' } },
            stroke: { curve: 'smooth' },
            xaxis: { type: "datetime" },
            dataLabels: { enabled: false },
            yaxis: { show: false },
            colors: ["#ff69f5"],
            tooltip: { y: { formatter: value => value.toFixed(2) }, theme: "dark" }
        },
        series: [{ name: 'Market Cap', data: [[1645837250522, 39804.53]] }]
    });

    const [totalVolumeData, setTotalVolumeData] = useState({
        options: {
            chart: { id: 'total-volume-line' },
            grid: { show: false },
            title: { text: "Market Volume (USD)", style: { fontSize: '14px', fontWeight: 'bold', color: "#39ff14" } },
            stroke: { curve: 'smooth' },
            xaxis: { type: "datetime" },
            dataLabels: { enabled: false },
            yaxis: { show: false },
            colors: ["#39ff14"],
            tooltip: { y: { formatter: value => value.toFixed(2) }, theme: "dark" }
        },
        series: [{ name: "Market Volume", data: [[1645837250522, 39804.53]] }]
    });

    // Fetch chart data from WebSocket
    const fetchData = () => {
        const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000');
        
        ws.onopen = () => {
            const requestMessage = JSON.stringify({ type: 'marketChartData', id, days: priceData.options.selection });
            ws.send(requestMessage);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setPriceData(prevData => ({ ...prevData, series: [{ name: 'Market Price', data: data.prices }] }));
            setMarketCapData(prevData => ({ ...prevData, series: [{ name: 'Market Cap', data: data.market_caps }] }));
            setTotalVolumeData(prevData => ({ ...prevData, series: [{ name: 'Market Volume', data: data.total_volumes }] }));
        };

        ws.onerror = error => console.error('WebSocket error:', error);
        ws.onclose = () => console.log('WebSocket closed');
    };

    // Fetch data every minute
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [id, priceData.options.selection]);

    return (
        <div className="p-4 bg-gray-900 text-white">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Price Chart */}
                <div className="flex-1">
                    <div id="chart">
                        <div className="toolbar mb-4">
                            {["1Day", "1Week", "1Month", "6Months", "1Year"].map((label, index) => {
                                const days = [1, 7, 30, 182, 365][index];
                                return (
                                    <button
                                        key={days}
                                        className="bg-gray-700 text-orange-300 rounded-lg p-2 mr-2 hover:bg-gray-600 hover:text-orange-500 transition-all duration-300"
                                        onClick={() => setPriceData(prevData => ({ ...prevData, options: { ...prevData.options, selection: days } }))}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <Chart options={priceData.options} series={priceData.series} type="area" height='400' width='100%' />
                    </div>
                </div>

                {/* Statistic Cards */}
                <div className="flex-none w-full px-4 sm:max-w-xs sm:px-0 mx-auto">
                    {[
                        { label: "Market Cap", value: marketCap },
                        { label: "Price Change 24hrs", value: priceChange24h },
                        { label: "Total Volume", value: totalVolume },
                        { label: "Circulating Supply", value: circulatingSupply },
                        { label: "Twitter Followers", value: twitterFollowers }
                    ].map(stat => (
                        <motion.div
                            key={stat.label}
                            className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex flex-col justify-center items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h6 className="text-lg font-semibold">{stat.label}</h6>
                            <p className="text-xl font-bold text-orange-400">${stat.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="flex flex-col lg:flex-row mt-4 gap-6">
                <div className="flex-1">
                    <Chart options={marketCapData.options} series={marketCapData.series} type="line" height='200' width='100%' />
                </div>
                <div className="flex-1">
                    <Chart options={totalVolumeData.options} series={totalVolumeData.series} type="line" height='200' width='100%' />
                </div>
            </div>
        </div>
    );
};

export default ChartSection;