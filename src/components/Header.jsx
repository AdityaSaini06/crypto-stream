import React from 'react';
import SignOut from '../components/auth/sign-out/SignOut';
import { motion } from 'framer-motion';

const Header = ({ handleSubmit }) => {
  return (
    <motion.nav 
      className="flex items-center justify-between p-4 bg-gray-800 shadow-lg rounded-t sm:flex-row"
      initial={{ opacity: 0 }} // Initial state: hidden
      animate={{ opacity: 1 }} // Final state: visible
      transition={{ duration: 0.8 }} // Animation duration
    >
      <div className='flex flex-row items-center justify-center'>
        {/* animation to the logo */}
        <motion.img
          src="/cryptocurrency.png"
          alt="crypto"
          width={60}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        &nbsp;&nbsp;
        {/* bounce effect to title */}
        <motion.a
          className="text-white text-4xl font-extrabold tracking-wide hover:text-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          href="/"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          CryptoStream
        </motion.a>
      </div>

      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap ml-10 ">
        {/* Adding hover effect to the dropdown */}
        <motion.select
          className="bg-gray-700 text-white border border-gray-600 rounded-lg p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg w-full sm:w-auto"
          aria-label="Select Coin"
          name="selectCoin"
          onChange={handleSubmit}
          whileHover={{ scale: 1.05 }} // Scale effect on hover
          transition={{ duration: 0.2 }}
        >
          <option value="bitcoin" className="bg-gray-800">Bitcoin (BTC)</option>
          <option value="avalanche-2" className="bg-gray-800">Avalanche (AVAX)</option>
          <option value="binancecoin" className="bg-gray-800">Binance (BNB)</option>
          <option value="cardano" className="bg-gray-800">Cardano (ADA)</option>
          <option value="decentraland" className="bg-gray-800">Decentraland (MANA)</option>
          <option value="dogecoin" className="bg-gray-800">Dogecoin (DOGE)</option>
          <option value="ethereum" className="bg-gray-800">Ethereum (ETH)</option>
          <option value="ripple" className="bg-gray-800">Ripple (XRP)</option>
          <option value="solana" className="bg-gray-800">Solana (SOL)</option>
          <option value="tether" className="bg-gray-800">Tether (USDT)</option>
        </motion.select>
        <SignOut />
      </div>
    </motion.nav>
  );
};

export default Header;
