import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
function Logout() {
   const nnavigate = useNavigate()
    useEffect(() => {
        Cookies.remove('access_token');
        Cookies.remove('isLoggedIn');
        Cookies.remove('Name');
        Cookies.remove('idCRM');
        nnavigate("/")
        window.location.reload(); 
        console.log("User logged out");
    }, []);

    return null; // or any other JSX if needed
}

export default Logout;
