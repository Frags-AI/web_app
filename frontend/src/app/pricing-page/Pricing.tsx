import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from 'lucide-react';
import Header from "../base/Header";
import Footer from "../base/Footer"
import FreePackage from "./FreePackage";
import Faq from "../faq/Faq";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faFacebook, faXTwitter, faLinkedin, faDiscord, faYoutube, faTiktok, faInstagram }  from '@fortawesome/free-brands-svg-icons'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate()

  const handleButtonClick = async (lookupKey: string) => {
    navigate("/checkout", {
      state: {
        lookupKey
      }
    })
  }

  const toggleBilling = () => setIsYearly(!isYearly);
  const socialIcons = [
    { icon: faFacebook, url: 'https://www.facebook.com/' },
    { icon: faXTwitter, url: 'https://twitter.com/' },
    { icon: faLinkedin, url: 'https://www.linkedin.com/' },
    { icon: faDiscord, url: 'https://discord.com/' },
    { icon: faYoutube, url: 'https://www.youtube.com/' },
    { icon: faTiktok, url: 'https://www.tiktok.com/' },
    { icon: faInstagram, url: 'https://www.instagram.com/' }
  ];
  return (
    <>
      <div>
        <Header />
        <div className=" pt-[150px] min-h-screen flex flex-col items-center py-16 px-6">
  
        <h1 className="text-4xl font-bold">Choose a plan</h1>

        <div className="flex items-center space-x-4 mt-4 font-bold">
          <span className={`${!isYearly ? "" : "text-muted-foreground"}`}>Monthly</span>

          <button
            type="button"
            onClick={toggleBilling}
            className="relative w-16 h-6 flex items-center bg-primary-invert rounded-full p-1 transition-colors duration-300"
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md"
              animate={{ x: isYearly ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />
          </button>

          <span className={`${isYearly ? "" : "text-muted-foreground"}`}>Yearly</span>
        </div>
        <p className="text-highlight mt-2 text-sm">Save up to 50% with annual billing</p>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {/* Creator Plan */}
          <Card className="!bg-transparent w-72 pt-4 flex flex-col justify-between h-full border border-muted p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
            <CardContent>
              <h2 className="text-3xl font-bold">Creator</h2>
              <p className="text-muted-foreground text-sm">For Individual Creators</p>
              <h1 className="text-3xl font-bold mt-4">${isYearly ? "90/year" : "9/mo"}</h1>
              <hr className="my-4 border-gray-700" />
              <ul className="space-y-2 text-sm">
                {["Virality Ranking", "Stream Clipping", "Aspect Ratio", "AI Subtitles", "Video Assets"].map((feature) => (
                  <li key={feature} className="flex items-center">
                        <Check className="text-highlight w-6 h-6 mr-2" />
                        {feature}
                  </li>
                ))}
                {["AI Voiceover", "Script Generator", "In-Built Editor", "AI Backgrounds"].map((feature) => (
                  <li key={feature} className="flex items-center text-muted-foreground">
                        <Check className="text-muted-foreground w-6 h-6 mr-2" />
                        {feature}
                  </li>
                ))}
              </ul>
              <Button 
                type="button" 
                className="mt-6 w-full border border-white rounded-full bg-transparent hover:bg-highlight hover:text-primary-invert hover:border-none font-bold transition duration-300"
                onClick={() => handleButtonClick(`creator_${isYearly ? "yearly" : "monthly"}`)}
                variant="outline"
              >
                Choose Creator
              </Button>
            </CardContent>
          </Card>

          {/* Clipper Plan (Most Popular) */}
          <Card className="w-80 h-[600px] pt-4 rounded-[10px] scale-105 flex flex-col justify-between h-full p-8 rounded-2xl shadow-lg border-2 border-highlight relative hover:scale-110 transition-transform duration-300">
            
          <CardContent >
              {/* Title & Badge Together */}
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold">Clipper</h2>
                <div className="flex items-center gap-1 rounded-full bg-highlight text-xs font-bold px-3 py-1 text-highlight-foreground">
                  <Sparkles className="w-4 h-4" /> MOST POPULAR
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-muted-foreground text-sm">For professional creators, marketers, & teams</p>

              {/* Pricing */}
              <h1 className="text-3xl font-bold mt-4">${isYearly ? "390/year" : "39/mo"}</h1>

              <hr className="my-4 border-gray-700" />

              {/* Features List */}
              <ul className="space-y-2 text-sm">
                {["Virality Ranking", "Stream Clipping", "Aspect Ratio", "AI Subtitles", "Video Assets", "AI Voiceover", "Script Generator"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="text-highlight w-6 h-6 mr-2" />
                    {feature}
                  </li>
                ))}

                {["In-Built Editor", "AI Backgrounds"].map((feature) => (
                  <li key={feature} className="flex items-center text-muted-foreground">
                    <Check className="text-muted-foreground w-6 h-6 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button 
                type="button" 
                className="mt-6 w-full rounded-full bg-white text-black hover:bg-highlight hover:text-primary-invert hover:border-none font-bold transition duration-300"
                onClick={() => handleButtonClick(`clipper_${isYearly ? "yearly" : "monthly"}`)}
                variant="outline"
              >
                Choose Clipper
              </Button>
          </CardContent>

          </Card>

          {/* Business Plan */}
          <Card className="!bg-transparent w-73 pt-4  flex flex-col justify-between h-full border border-[828282] p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
            <CardContent>
              <h2 className="text-3xl font-bold">Business</h2>
              <p className="text-muted-foreground text-sm">For businesses with custom needs</p>
              <h1 className="text-3xl font-bold mt-4">${isYearly ? "690/year" : "69/mo"}</h1>
              <hr className="my-4 border-gray-700" />
              <ul className="space-y-2 text-sm">
                {["Virality Ranking", "Stream Clipping", "Aspect Ratio", "AI Subtitles", "Video Assets", "AI Voiceover", "Script Generator", "In-Built Editor", "AI Backgrounds"].map((feature) => (
                  <li key={feature} className="flex items-center">
                        <Check className="text-highlight w-6 h-6 mr-2"/>
                        {feature}
                  </li>
                ))}
              </ul>
              <Button 
                type="button" 
                className="mt-6 w-full border border-white rounded-full hover:border-none bg-transparent font-bold hover:bg-highlight hover:text-primary-invert transition duration-300"
                onClick={() => handleButtonClick(`business_${isYearly ? "yearly" : "monthly"}`)}
                variant="outline"
                >
                  Get Business
              </Button>
            </CardContent>
          </Card>
        

        </div>
        <FreePackage isYearly={isYearly}/>
        <div className="flex gap-5 mt-1 pt-1 mb-20 flex flex-col justify-between">
          <p className="text-muted-foreground text-sm mb-5 text-center">Which platforms will you post to?</p>
          <div className='flex-1 flex gap-10 justify-center lg:justify-start'>
              {socialIcons.map((icon) => (
                <a href={icon.url} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'>
                  <FontAwesomeIcon icon={icon.icon} size="2xl" className=""></FontAwesomeIcon>
                </a>
              ))}
            </div>
        </div>
        <Faq/> 
      </div>
      
      <Footer/>
      </div>
    </>
  );
};

export default Pricing;
