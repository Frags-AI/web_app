import React from "react";
import { Check } from 'lucide-react';

interface FreePackageProps {
  isYearly: boolean; // Prop to determine the billing cycle
}

const FreePackage: React.FC<FreePackageProps> = ({ isYearly }) => {
  return (
    <div className=" w-full max-w-[975px] flex justify-center items-center text-center py-16">
      <div className="w-full max-w-[1060px] rounded-3xl shadow-lg flex flex-col md:flex-row p-10 transition-transform duration-300">
        {/* First Section - Free Plan Info */}
        <div className="flex flex-col items-center justify-center text-center flex-1 px-6">
        <h2 className="text-3xl font-bold pb-2">FREE</h2>
        <p className="text-muted-foreground text-sm pb-5">For Starters</p>
          <h1 className="text-4xl font-bold">
            $0<span className="text-gray-500 text-lg">{isYearly ? "/year" : "/mo"}</span>
          </h1>
          <button className="mt-8 p-2 mx-6 my-3 w-full border border-white rounded-full bg-transparent hover:bg-highlight hover:text-primaryInvert hover:border-highlight transition duration-300 font-bold">
            Start Free Trial
          </button>
        </div>

        {/* Vertical Line */}
        <div className="hidden md:block w-[1px] bg-muted h-56 mx-10"></div>

        {/* Second Section - Features Included */}
        <div className="flex flex-col items-start justify-center flex-1 space-y-3 px-6">
          {["Virality Ranking", "Stream Clipping"].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Check className="text-highlight w-6 h-6 mr-2" />
              <p className="">{feature}</p>
            </div>
          ))}
        </div>

        {/* Third Section - Features Not Included */}
        <div className="flex flex-col items-start justify-center flex-1 space-y-3 px-6">
          {[
            "NO Aspect Ratio",
            "NO AI Subtitles",
            "NO Video Assets",
            "NO AI Voiceover",
            "NO Script Generator",
            "NO In-built Editor",
            "NO AI Backgrounds",
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              
              <p className="text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreePackage;
