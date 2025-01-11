// Provider.js
'use client';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserDetailContext } from './app/_context/UserDetailContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user) {
      verifyUser();
    }
  }, [user]);

  const verifyUser = async () => {
    try {
      const response = await axios.post('/api/verify-user', { user });
      if (response.data && response.data.result) {
        setUserDetail(response.data.result);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const initialOptions = {
    clientId: "AdiUzqc_pyp1tw3w-V_fR5oLM_UL8Esc-G4Im2iPgfa8AtcN0Ov7Owf-cH4vx9Z5IlYwXaOIj__nd0XO",
    currency: "USD",
    intent: "capture"
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider options={initialOptions}>
        {children}
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  );
};

export default Provider;