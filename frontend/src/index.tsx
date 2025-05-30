import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/clerk-react';
import { TooltipProvider } from './components/ui/tooltip';
import localization from '@/clerk/localization';
import './index.css';
import App from './App';
import appearance from './clerk/clerkStyles';
import { Toaster } from '@/components/ui/sonner';


const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SIGNIN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const SIGNUP_URL = import.meta.env.VITE_CLERK_SIGN_UP_URL;

if (!PUBLISHABLE_KEY) {
  console.error('Clerk Publishable Key is missing. Add it to the .env file.');
  throw new Error('Clerk Publishable Key is missing.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div className='font-inter'>
    <React.StrictMode>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider 
              publishableKey={PUBLISHABLE_KEY} 
              signInUrl={SIGNIN_URL}
              signUpUrl={SIGNUP_URL}
              localization={localization}
              signInFallbackRedirectUrl='/'
              signUpFallbackRedirectUrl='/'
              appearance={appearance}
          >
            <TooltipProvider>
              <App />
              <Toaster/>
            </TooltipProvider>
          </ClerkProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  </div>
);

