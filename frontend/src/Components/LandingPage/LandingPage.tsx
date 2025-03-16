import React from "react";
import Home from "./Home";
import Features from './Features';
import Prefooter from './Prefooter';
import Header from '../Base/Header';
import Faq from '../Faq/Faq';
import Footer from '../Base/Footer';
import Credentials from './Credentials';
import Carousel from "./Carousel";
import Mission from "./Mission";

const LandingPage: React.FC = () => {

  return (
    <>
      <Header/>
      <Home />
      <Credentials/>
      <Features/>
      <Carousel />
      <Mission/>
      <Faq/>
      <Prefooter/>
      <Footer/>
    </>
  );
}

export default LandingPage;
