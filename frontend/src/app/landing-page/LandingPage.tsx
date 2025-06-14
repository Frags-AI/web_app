import Home from "./Home";
import Features from './Features';
import Prefooter from "../base/Prefooter";
import Header from '../base/Header';
import Faq from '../faq/Faq';
import Footer from '../base/Footer';
import Credentials from './Credentials';
import Carousel from "./Carousel";
import Mission from "./Mission";

const LandingPage = () => {

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
