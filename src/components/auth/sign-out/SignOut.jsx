import React from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";

const SignOut = () => {
    const navigate = useNavigate();

    // Handles the sign-out process
    const handleSignOut = async () => {
        try {
            await signOut(auth);  // Sign out the user
            navigate('/sign-up'); // Redirect to sign-up page
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        // Button with fixed size
        <button 
            onClick={handleSignOut} 
            className="bg-yellow-400 text-gray-800 rounded-lg py-2 px-4 h-10 w-30 whitespace-nowrap hover:bg-yellow-500 transition-colors duration-300">
            Sign Out
        </button>
    );
};

export default SignOut;
