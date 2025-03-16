import React from 'react';
import BlogPage from './components/Blog/BlogPage';
import LandingPage from './components/LandingPage/LandingPage';
import Subscription from './components/Subscription/Subscription';
import Profile from './components/Profile/Profile';
import Pricing from './components/PricingPage/Pricing';
import Product from './components/ProductPage/Product';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import { ClerkProvider } from '@clerk/clerk-react';
import ScrollToTop from './components/Accessories/ScrollToLocation';
import SignOut from './components/Authentication/SignOut';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Access environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SIGNIN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const SIGNUP_URL = import.meta.env.VITE_CLERK_SIGN_UP_URL;

if (!PUBLISHABLE_KEY) {
  console.error('Clerk Publishable Key is missing. Add it to the .env file.');
  throw new Error('Clerk Publishable Key is missing.');
}

const App = () => {

    const localization = {
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'to continue to {{applicationName}}',
            actionText: 'Already Have An Account?',
            actionLink: 'Sign In',
          },
          emailLink: {
            title: 'Verify your email',
            subtitle: 'to continue to {{applicationName}}',
            formTitle: 'Verification link',
            formSubtitle: 'Use the verification link sent to your email address',
            resendButton: "Didn't receive a link? Resend",
            verified: {
              title: 'Successfully signed up',
            },
            loading: {
              title: 'Signing up...',
            },
            verifiedSwitchTab: {
              title: 'Successfully verified email',
              subtitle: 'Return to the newly opened tab to continue',
              subtitleNewTab: 'Return to previous tab to continue',
            },
          },
          emailCode: {
            title: 'Verify your email',
            subtitle: 'to continue to {{applicationName}}',
            formTitle: 'Verification code',
            formSubtitle: 'Enter the verification code sent to your email address',
            resendButton: "Didn't receive a code? Resend",
          },
          phoneCode: {
            title: 'Verify your phone',
            subtitle: 'to continue to {{applicationName}}',
            formTitle: 'Verification code',
            formSubtitle: 'Enter the verification code sent to your phone number',
            resendButton: "Didn't receive a code? Resend",
          },
          continue: {
            title: 'Fill in missing fields',
            subtitle: 'to continue to {{applicationName}}',
            actionText: 'Already Have An Account?',
            actionLink: 'Sign In',
          },
        },
      }

    return (
        <QueryClientProvider client={queryClient}>
            <React.StrictMode>
                <ClerkProvider 
                publishableKey={PUBLISHABLE_KEY} 
                afterSignOutUrl="/" 
                signInUrl={SIGNIN_URL}
                signUpUrl={SIGNUP_URL}
                localization={localization}
                >
                <Router>
                    <ScrollToTop>
                    <Routes>
                        <Route path="/blog" element={<BlogPage/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/subscription" element={<Subscription/>}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signout" element={<SignOut />} />
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/product" element={<Product />} />
                    </Routes>
                    </ScrollToTop>
                </Router>
                </ClerkProvider>
            </React.StrictMode>
        </QueryClientProvider>
    )
}

export default App;
