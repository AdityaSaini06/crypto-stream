import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle sign-up with email and password
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            navigate('/'); // Redirect after sign-up
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Handle Google sign-up
    const onGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect after Google sign-up
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Animation variants
    const formVariant = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const buttonVariant = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-600">
            {/* Sign-up form */}
            <motion.div 
                className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
                initial="hidden"
                animate="visible"
                variants={formVariant}
            >
                {/* Logo animation */}
                <div className='flex justify-center items-center'>
                    <motion.img 
                        src="/cryptocurrency.png" 
                        alt="crypto" 
                        width={90} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-4">Sign-Up To CryptoStream</h2>
                {/* Email and password form */}
                <motion.form 
                    onSubmit={onSubmit} 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={formVariant}
                >
                    {/* Email input */}
                    <motion.input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }} 
                    />
                    {/* Password input */}
                    <motion.input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
                        whileFocus={{ scale: 1.02 }}
                    />
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                    {/* Submit button */}
                    <motion.button 
                        type="submit" 
                        className="w-full bg-blue-400 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                        variants={buttonVariant}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Sign Up
                    </motion.button>
                </motion.form>
                <p className="text-center text-white mt-4">OR</p>
                {/* Google sign-up button */}
                <motion.button 
                    onClick={onGoogleSignUp} 
                    className="w-full bg-red-400 text-white font-bold py-2 rounded-lg hover:bg-red-500 transition duration-200"
                    variants={buttonVariant}
                    whileHover="hover"
                    whileTap="tap"
                >
                    Sign Up with Google
                </motion.button>
                <p className="text-center text-white mt-4">
                    Already have an account? 
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-blue-400 hover:underline ml-1"
                    >
                        Login
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
