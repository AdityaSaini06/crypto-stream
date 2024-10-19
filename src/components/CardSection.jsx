import React from 'react';
import { motion } from 'framer-motion';

const CardSection = ({   
  coinName, 
  currentPrice, 
  marketCap24hr, 
  alltimehigh, 
  alltimelow, 
  sentiment, 
  highest24hr, 
  lowest24hr 
}) => {
  
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="p-6 bg-gray-900 text-white shadow-lg"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
    >
      {/* Coin Name */}
      <motion.h2 
        className="text-4xl font-bold text-center mb-8 capitalize border-b-2 border-gray-700 pb-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {coinName}
      </motion.h2>
      
      {/* Stats Section with Cards */}
      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {/* Market Cap Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">Market Cap 24Hrs</h6>
          <p className="text-2xl font-bold text-yellow-300">{marketCap24hr} %</p>
        </motion.div>

        {/* All Time High Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">All Time High</h6>
          <p className="text-2xl font-bold text-yellow-300">${alltimehigh}</p>
        </motion.div>

        {/* All Time Low Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">All Time Low</h6>
          <p className="text-2xl font-bold text-yellow-300">${alltimelow}</p>
        </motion.div>

        {/* Positive Sentiments Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">Positive Sentiments</h6>
          <p className="text-2xl font-bold text-yellow-300">{sentiment} %</p>
        </motion.div>

        {/* Highest 24Hrs Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">Highest In Last 24Hrs</h6>
          <p className="text-2xl font-bold text-green-300">${highest24hr}</p>
        </motion.div>

        {/* Lowest 24Hrs Card */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg text-center shadow-md "
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
        >
          <h6 className="text-lg font-semibold mb-2">Lowest In Last 24Hrs</h6>
          <p className="text-2xl font-bold text-red-500">${lowest24hr}</p>
        </motion.div>
      </motion.section>

      {/* Current Price */}
      <motion.div 
        className="text-center mt-8 border-t-2 border-gray-700 pt-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-2">Current Price</h3>
        <p className="text-6xl font-extrabold text-yellow-300">${currentPrice}</p>
      </motion.div>
    </motion.div>
  );
}

export default CardSection;  
