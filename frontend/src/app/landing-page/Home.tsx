import React from "react";
import Icons from "../../components/icons";

const Home: React.FC = () => {
  return (
    <>
        <div className="flex mt-40 w-full self-center flex-col items-center gap-[80px]">
            <div className="flex-1 flex flex-col text-center content-center gap-3">
                <div className="text-[#00D4CA]">#1 AI Gaming Clipping Tool</div>
                <div className="flex-1 flex self-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    <div className="text-[#FDFDFD]">Create viral-ready clips</div>
                    <div className="whitespace-pre text-[#FDFDFD]"> 10x faster</div>
                </div>
                <div className="text-[#FFFFFF] text-xs md:text-base lg:text-lg px-2">Frags turns long videos into shorts, making content easy, saving you time, and grows your presence</div>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-[16px] items-center">
                <div className="bg-[#424242] flex gap-16 py-2 px-2 rounded-full items-center content-between">
                    <div className="flex flex-colflex-1 gap-2 px-3 text-[#717383]">
                        <Icons.Link />
                        <div className="text-sm md:text-base lg:text-lg text-nowrap">Drop a video link</div>                        
                    </div>
                    <button className="bg-white text-sm text-black w-2/3 py-3 px-8 rounded-full hover:bg-[#f0f0f0] transition duration-300 text-md">Create Free Clips</button>
                </div>
                <div>or</div>
                <button className="outline outline-2 outline-white rounded-full py-2 px-8 transition duration-300 hover:bg-[#424242]">Upload Video</button>
            </div>
            <div className="text-xl">Games our product currently support</div>
            <div className="flex gap-4 flex-wrap items-center justify-center">
                <img src="./assets/valLogo.png" alt="Valorant Logo" />
                <img src="./assets/codLogo.png" alt="Call of Duty Logo" />
                <img src="./assets/fortniteLogo.png" alt="Fortnite Logo" />
                <img src="./assets/warzoneLogo.png" alt="Warzone Logo" />
                <img src="./assets/csLogo.png" alt="Counter-Strike Logo" />
            </div>  
            <div className="w-3/5 h-[600px] bg-[#515151] rounded-lg"></div>
        </div> 

    </>
  )
}

export default Home;