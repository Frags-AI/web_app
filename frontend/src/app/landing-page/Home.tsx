import Icons from "../../components/icons";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
        <div className="flex mt-40 w-full self-center flex-col items-center gap-[80px]">
            <div className="flex-1 flex flex-col text-center content-center gap-3">
                <div className="text-highlight">#1 AI Gaming Clipping Tool</div>
                <div className="flex-1 flex self-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    <div>Create viral-ready clips</div>
                    <div className="whitespace-pre"> 10x faster</div>
                </div>
                <div className="text-xs md:text-base lg:text-lg px-2">Frags turns long videos into shorts, making content easy, saving you time, and grows your presence</div>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-[16px] items-center">
                <div className="bg-muted flex gap-16 py-2 px-2 rounded-full items-center content-between">
                    <div className="flex flex-1 gap-2 px-3">
                        <Icons.Link />
                        <div className="text-sm md:text-base lg:text-lg text-nowrap">Drop a video link</div>                        
                    </div>
                    <button className="text-sm bg-primary-invert w-2/3 py-3 px-8 rounded-full transition duration-300 text-md">Create Free Clips</button>
                </div>
                <div>or</div>
                <Button className="outline outline-2 rounded-full py-2 px-8 transition duration-300" variant="outline">Upload Video</Button>
            </div>
            <div className="text-xl">Games our product currently support</div>
            <div className="flex gap-4 flex-wrap items-center justify-center">
                <img src="./assets/valLogo.png" alt="Valorant Logo" />
                <img src="./assets/codLogo.png" alt="Call of Duty Logo" />
                <img src="./assets/fortniteLogo.png" alt="Fortnite Logo" />
                <img src="./assets/warzoneLogo.png" alt="Warzone Logo" />
                <img src="./assets/csLogo.png" alt="Counter-Strike Logo" />
            </div>  
            <div className="w-3/5 h-[600px] bg-muted rounded-lg"></div>
        </div> 

    </>
  )
}

export default Home;