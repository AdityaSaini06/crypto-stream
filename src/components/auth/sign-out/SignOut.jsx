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
        // Button to trigger sign-out
        <button 
            onClick={handleSignOut} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
            Sign Out
        </button>
    );
};

export default SignOut;
