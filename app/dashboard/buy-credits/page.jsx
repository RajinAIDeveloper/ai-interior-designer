'use client'
import React, { useState, useContext } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CreditOption } from './_components/CreditOptions';
import { UserDetailContext } from '../../_context/UserDetailContext';
import { toast } from "react-hot-toast";

const CreditPurchase = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const options = [
    { credits: 5, price: '0.99' },
    { credits: 10, price: '1.99' },
    { credits: 25, price: '3.99' },
    { credits: 50, price: '6.99' },
    { credits: 100, price: '9.99' },
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setError(null);
  };

  const createOrder = (data, actions) => {
    if (!userDetail?.id) {
      setError('Please log in to purchase credits');
      return Promise.reject('User not logged in');
    }

    if (!selectedOption) {
      setError('Please select a credit package first');
      return Promise.reject('No credit package selected');
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: selectedOption.price,
            currency_code: "USD"
          },
          description: `${selectedOption.credits} AI Remodelling Credits`
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      setError(null);
      
      // First capture the PayPal order
      const order = await actions.order.capture();
      
      // Then update the user's credits in our database
      const response = await axios.post('/api/update-credits', {
        credits: selectedOption.credits,
        orderId: order.id,
        userId: userDetail.id,
        currentCredits: userDetail.credits || 0
      });

      if (response.data.success) {
        // Update context with new credit amount
        setUserDetail(prev => ({
          ...prev,
          credits: response.data.updatedCredits
        }));

        toast.success('Credits successfully added to your account!');
        router.push('/dashboard');
      } else {
        throw new Error(response.data.error || 'Failed to update credits');
      }

    } catch (err) {
      console.error('Error updating credits:', err);
      setError('Payment was successful but credits could not be added. Our team has been notified.');
      toast.error('Failed to add credits. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    setError('Payment failed. Please try again or use a different payment method.');
    toast.error('Payment failed. Please try again.');
  };

  if (!userDetail) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-red-600">Please log in to purchase credits</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Buy More Credits</h2>
        <p className="text-gray-600 flex items-center">
          Unlock endless possibilities - Buy more credits and transform your room with AI Remodelling
          <span className="ml-2">✨</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Current credits: {userDetail.credits || 0}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {options.map((option) => (
          <CreditOption
            key={option.credits}
            credits={option.credits}
            price={option.price}
            isSelected={selectedOption?.credits === option.credits}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {selectedOption && (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="text-center text-gray-700 mb-4">
            Selected package: {selectedOption.credits} Credits for ${selectedOption.price}
          </div>
          <div className="w-full max-w-md">
            <PayPalButtons
              style={{ layout: "vertical", label: "pay" }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              forceReRender={[selectedOption?.credits]}
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
          {loading && (
            <div className="text-gray-600 text-center mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
              Processing payment...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditPurchase;