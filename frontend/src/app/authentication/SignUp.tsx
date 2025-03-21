import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom'
import Header from "../base/Header";
import Footer from "../base/Footer";
import appearance from '@/clerkStyles';

const SignUpPage: React.FC = () => {
  const location = useLocation()
  const from = location.state?.from.pathname || '/'


  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen mt-32 mb-16">
      <SignUp 
        appearance={appearance}
        path="/signup"
        forceRedirectUrl={from}
      />
      </div>
      <Footer />
    </>
  );
}

export default SignUpPage
