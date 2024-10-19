import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 

const Login = () => {
    const [email, setEmail] = useState('');  // State to store email
    const [password, setPassword] = useState('');  // State to store password
    const [errorMessage, setErrorMessage] = useState('');  // Error message for login
    const { currentUser } = useAuth();  // Get current user from auth context
    const navigate = useNavigate();  // Navigation hook

    // Redirect to homepage if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/'); 
        }
    }, [currentUser, navigate]);

    // Handle login form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);  // Email/password login
            setEmail('');
            setPassword('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Handle Google sign-in
    const onGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);  // Google login
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const formVariant = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const buttonVariant = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 }
    };

    return (
        // Login form layout
        <div className="flex items-center justify-center min-h-screen bg-slate-600">
            <motion.div 
                className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full"
                initial="hidden"
                animate="visible"
                variants={formVariant}
            >
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
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}  {/* Display error message */}
                <h2 className="text-2xl font-bold text-center text-white mb-4">Log-in To CryptoStream</h2>
                
                {/* Login form */}
                <motion.form 
                    onSubmit={onSubmit} 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={formVariant}
                >
                    <motion.input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        whileFocus={{ scale: 1.02 }} 
                    />
                    <motion.input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                        type="submit"
                        className="w-full bg-blue-400 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                        variants={buttonVariant}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Login
                    </motion.button>
                </motion.form>
                
                <p className="text-center text-white mt-4">OR</p>
                <br />
                
                {/* Google login button */}
                <motion.button
                    onClick={onGoogleSignIn}
                    className="w-full bg-red-400 text-white font-bold py-2 rounded-lg hover:bg-red-500 transition duration-200"
                    variants={buttonVariant}
                    whileHover="hover"
                    whileTap="tap"
                >
                    Login with Google
                </motion.button>
                
                <p className="text-center text-white mt-4">
                    Don’t have an account? 
                    <Link to="/sign-up" className="text-blue-400 hover:underline ml-1">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
