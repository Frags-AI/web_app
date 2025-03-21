import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

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

const queryClient = new QueryClient();

// Access environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SIGNIN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const SIGNUP_URL = import.meta.env.VITE_CLERK_SIGN_UP_URL;

if (!PUBLISHABLE_KEY) {
  console.error('Clerk Publishable Key is missing. Add it to the .env file.');
  throw new Error('Clerk Publishable Key is missing.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div className='dark font-inter text-white'>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY} 
            signInUrl={SIGNIN_URL}
            signUpUrl={SIGNUP_URL}
            localization={localization}
            signInFallbackRedirectUrl='/'
            signUpFallbackRedirectUrl='/'
        >
          <App />
        </ClerkProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </div>
);

