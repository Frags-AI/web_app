import React from 'react';

const Prefooter: React.FC = () => {
  return (
    <section className="flex justify-center items-center h-[790px] px-5 text-center text-white mb-[70px] bg-cover bg-center">
      <div className="max-w-[800px] mx-auto mb-[50px]">
        {/* Title with exact gradient */}
        <h1 className="text-[5rem] font-bold mb-5 bg-gradient-to-l from-white to-[#fff] text-transparent bg-clip-text">
          120 minutes of free clipping every month
        </h1>

        {/* Buttons with exact styles */}
        <div className="flex flex-col items-center space-y-[20px]">
          <a href="#signup" className="flex items-center justify-center bg-white text-black font-bold text-[1rem] rounded-full border border-[#fff] px-[60px] py-[10px] w-1/2 transition-transform duration-300 hover:-translate-y-1  mt-[100px]">
            Get Started For Free
          </a>
          <a className="flex items-center justify-center bg-transparent text-[#797979] font-bold text-[1rem] rounded-full  px-[60px] py-[10px] transition-transform duration-300 hover:-translate-y-1">
            No credit card required
          </a>
        </div>
      </div>
    </section>
  );
};

export default Prefooter;
