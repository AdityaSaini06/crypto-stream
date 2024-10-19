import { useEffect, useState } from 'react';
import CardSection from './components/CardSection';
import ChartSection from './components/ChartSection';
import Header from './components/Header';
import { AuthProvider } from './context/authContext';
import Login from './components/auth/login/login';
import SignUp from './components/auth/signup/signup';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import {motion} from 'framer-motion'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/sign-up" />;
};

const App = () => {
  const [coinId, setCoinId] = useState("bitcoin"); //state to hold current coin id
  const [coinData, setCoinData] = useState({}); // state to hold fetched coin data

  const fetchData = () => {
    // Create a new WebSocket connection to the backend
    const ws = new WebSocket("ws://localhost:5000");

    // When the WebSocket connection is open, send the request to the server
    ws.onopen = () => {
      const requestMess = JSON.stringify({
        type: "cryptoData", // Type to indicate this is for coin data
        id: coinId,
      });
      ws.send(requestMess);
    };

    // Listen for messages from the server
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      setCoinData(data); // Update your state with the received data
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket closure
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  //function to handle submission of new crypto
  const handleSubmit = (e) => {
    const newCoinId = e.target.value;
    setCoinId(newCoinId);
  };

  //useeffect to fetch data and set up interval for updation
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);}, [coinId]); //coinID act as dependency array i.e. refetch data when its values changes

  //passing data as props to components
  return (
    <AuthProvider>
      <Router>
        <div className="bg-slate-600 min-h-screen text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Header handleSubmit={handleSubmit} />
                  <motion.div
                    initial={{ opacity: 0, y: -20 }} // Initial state
                    animate={{ opacity: 1, y: 0 }} // Animate to this state
                    exit={{ opacity: 0, y: 20 }} // Animate out state
                    transition={{ duration: 0.5 }} // Duration of the animation
                  >
                    <CardSection
                      coinName={coinData.name}
                      currentPrice={
                        coinData.market_data
                          ? coinData.market_data.current_price["usd"]
                          : ""
                      }
                      marketCap24hr={
                        coinData.market_data
                          ? coinData.market_data
                              .market_cap_change_percentage_24h
                          : ""
                      }
                      alltimehigh={
                        coinData.market_data ? coinData.market_data.ath.usd : ""
                      }
                      alltimelow={
                        coinData.market_data ? coinData.market_data.atl.usd : ""
                      }
                      sentiment={coinData.sentiment_votes_up_percentage}
                      highest24hr={
                        coinData.market_data
                          ? coinData.market_data.high_24h["usd"]
                          : ""
                      }
                      lowest24hr={
                        coinData.market_data
                          ? coinData.market_data.low_24h["usd"]
                          : ""
                      }
                    />
                    <ChartSection
                      id={coinId}
                      priceChange24h={
                        coinData.market_data
                          ? coinData.market_data.price_change_24h_in_currency
                              .usd
                          : ""
                      }
                      marketCap={
                        coinData.market_data
                          ? coinData.market_data.market_cap.usd
                          : ""
                      }
                      totalVolume={
                        coinData.market_data
                          ? coinData.market_data.total_volume.usd
                          : ""
                      }
                      circulatingSupply={
                        coinData.market_data
                          ? coinData.market_data.circulating_supply
                          : ""
                      }
                      twitterFollowers={
                        coinData.community_data
                          ? coinData.community_data.twitter_followers
                          : ""
                      }
                    />
                  </motion.div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
