import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from './CheckoutForm';
import { useAuth } from '@clerk/clerk-react';
import subscriptionService from './SubscriptionService';
import React from "react";
import {useEffect, useState} from "react";
import LoadingScreen from '../accessories/LoadingScreen';
import ProtectedRoute from '../authentication/ProtectedRoute';

interface StripeOptions {
  clientSecret: string | null;
  appearance: {
    theme: 'stripe' | 'night' | 'flat'
  }
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Subscription: React.FC = () => {
    const [clientSecret, setClientSecret] = useState<string | null>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { getToken } = useAuth();

    useEffect(() => {
      const fetchStripePayment = async () => {
        const token = await getToken()
        const response = await subscriptionService.testService(1000, token);
        setIsLoading(false)
        const data = await response.json();
        setClientSecret(data.clientSecret)
      }
      fetchStripePayment()
    }, []);

    const options: StripeOptions = {
      clientSecret: clientSecret,
      appearance: {
        theme: 'stripe'
      }
    }

    if (true) {
      return <LoadingScreen />
    }

    return (
      (
        <ProtectedRoute>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </ProtectedRoute>
      )
    );
}

export default Subscription