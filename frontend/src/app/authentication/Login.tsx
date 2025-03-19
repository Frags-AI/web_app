import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom'
import Header from "../base/Header";
import Footer from "../base/Footer"
import appearance from '@/clerkStyles';

const SignInPage: React.FC = () => {
  const location = useLocation()
  const from = location.state?.from.pathname || '/'

  if (location?.state?.from?.state?.lookupKey) {
    console.log(location.state.from.state.lookupKey)
    localStorage.setItem("lookupKey", location.state.from.state.lookupKey)
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen">
          <SignIn 
            appearance={appearance}
            routing="path"
            path="/login"
            signUpUrl="/signup"
            fallbackRedirectUrl={from}
          />
      </div>
      <Footer />
    </>
  );
}

export default SignInPage
