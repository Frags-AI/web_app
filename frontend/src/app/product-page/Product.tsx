import React, { useState, useEffect } from "react";
import Header from "../base/Header";
import Footer from "../base/Footer";
import Faq from "../faq/Faq";

const SECTIONS = [
    {
        id: "viralMoments",
        label: "Auto Detection",
        title: "Capture Viral Moments Instantly",
        description: "AI-powered detection ensures you never miss a highlight by automatically selecting the best moments."
    },
    {
        id: "editPro",
        label: "AI Editor",
        title: "Edit like a pro, instantly",
        description: "Professional editing made effortless. Access AI-powered tools, gaming-specific assets, and smart effects in one intuitive interface."
    },
    {
        id: "perfectFit",
        label: "Smart Format",
        title: "Perfect Fit, Every Platform",
        description: "Perfect fit on every platform. Intelligent background generation and aspect ratio optimization ensure your content always fits perfectly on every platform from YouTube to TikTok and Instagram."
    },
    {
        id: "storytelling",
        label: "Content Creation",
        title: "Tell Engaging Stories Effortlessly",
        description: "Create compelling narratives with AI-assisted content structuring and visual enhancements."
    },
    {
        id: "global",
        label: "Global Access",
        title: "Reach Global Audiences",
        description: "Auto-generated subtitles and translations that understand gaming terminology and culture."
    }
];


const Product: React.FC = () => {
    const [activeSection, setActiveSection] = useState("");

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = "";
            SECTIONS.forEach(({ id }) => {
                const section = document.getElementById(id);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                        currentSection = id;
                    }
                }
            });
            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col justify-start items-center px-5 mt-[160px]">
                {/* Main Title */}
                <p className="text-[16px] text-[#00D4CA] font-inter mb-[10px]">#1 AI Gaming Clipping Tool</p>
                <span className="text-[50px] font-bold text-white font-inter mb-[10px]">Dominate. Clip. Share.</span>
                <span className="text-[16px] text-white font-inter mb-[10px]">
                    Automatically detect and clip your most epic gaming moments with AI precision
                </span>

                {/* Start Clipping Button */}
                <button className="rounded-[20px] bg-white text-[#050406] text-center text-[16px] w-[150px] py-[10px] mt-[70px]">
                    Start Clipping
                </button>

                {/* Games Section */}
                <span className="text-[16px] text-white mt-[90px] mb-[10px]">Games our product currently support</span>
                <div className="flex justify-between items-center gap-[20px] py-[20px]">
                    <img className="max-w-[100px] h-auto" src="./assets/valLogo.png" />
                    <img className="max-w-[100px] h-auto" src="./assets/codLogo.png" />
                    <img className="max-w-[100px] h-auto" src="./assets/fortniteLogo.png" />
                    <img className="max-w-[100px] h-auto" src="./assets/warzoneLogo.png" />
                    <img className="max-w-[100px] h-auto" src="./assets/csLogo.png" />
                </div>

                {/* Feature Buttons (Scroll to Sections) */}
                <div className="flex justify-between items-center gap-[20px] py-[20px] flex-wrap">
                    {SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={`rounded-[20px] text-center text-[16px] w-[150px] py-[10px] mt-[70px] border transition-all duration-300 
                            ${
                                activeSection === id
                                    ? "bg-[#00D4CA] text-black border-[#00D4CA]"
                                    : "bg-[#050406] text-[#FDFDFD] border-[#717383] hover:border-[#00D4CA] hover:text-[#00D4CA]"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Transformation Text */}
                <span className="text-[50px] text-white font-inter mt-[90px] mb-[40px]">Transform Gameplay into Viral Content</span>

                {/* Content Display (Blocks) */}
                {SECTIONS.map(({ id, label, title, description }, index) => (
                    <div
                        key={id}
                        id={id}
                        className="flex justify-center items-center gap-[20px] py-[20px] flex-wrap mt-[90px] transition-opacity duration-500"
                    >
                        {/* Text Content */}
                        <div className="max-w-[450px]">
                            <span className="text-white font-bold text-xl">{title}</span>
                            <p className="text-white text-md">{description}</p>
                        </div>

                        {/* Image Block */}
                        <div className="relative w-[513px] h-[400px] bg-[#1a1a1a] rounded-lg shadow-lg flex items-center justify-end pr-4">
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[40px] h-[2px]"></div>
                        </div>
                    </div>
                ))}



                {/* How It Works Section */}
                <span className="text-[16px] text-[#514D59] font-inter mt-[200px] mb-[10px]">How it works</span>
                <span className="text-[45px] text-white font-inter mt-[5px] mb-[10px]">Create Frags viral clips in 3 steps</span>

                {/* Steps Display */}
                <div className="flex flex-wrap justify-center items-center gap-[50px] py-[20px] mb-[100px]">
                    <div className="text-white">
                        {["Upload your gameplay", "AI Magic", "Viral Ready"].map((text, index) => (
                            <div key={index}>
                                <hr className="w-full h-[1px] bg-[#929292] my-[20px]" />
                                <p className="text-[25px] flex justify-between items-center hover:text-[#00D4CA]">
                                    {text} <span className="float-right">{`0${index + 1}`}</span>
                                </p>
                                {index === 0 && (
                                    <span className="text-[#929292]">
                                        Simply upload video file or drop your raw gaming footage video link
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="relative w-[513px] h-[400px] bg-[#1a1a1a] rounded-lg shadow-lg flex items-center justify-end pr-4">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[40px] h-[2px]"></div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <Faq />

            {/* Call to Action Section */}
            <section className="flex justify-center items-center h-[790px] px-5 text-center text-white mb-[70px] bg-cover bg-center">
                <div className="max-w-[800px] mx-auto mb-[50px]">
                    <h1 className="text-[5rem] font-bold mb-5 bg-gradient-to-l from-white to-[#fff] text-transparent bg-clip-text">
                        Ready to Create Content That Goes Viral?
                    </h1>
                    <div className="flex flex-col items-center space-y-[20px]">
                        <a href="#signup" className="flex items-center justify-center bg-white text-black font-bold text-[1rem] rounded-full border border-[#fff] px-[60px] py-[10px] w-1/2 transition-transform duration-300 hover:-translate-y-1 mt-[100px]">
                            Start creating for free
                        </a>
                        <a className="flex items-center justify-center bg-transparent text-[#797979] font-bold text-[1rem] rounded-full px-[60px] py-[10px] transition-transform duration-300 hover:-translate-y-1">
                            No credit card required
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Product;
