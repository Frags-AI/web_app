import React from "react";
import { Button } from "../ui/button";

interface MissionProps {
    title: string;
    description: string;
    src: string;
    alt: string;
}

const missions: MissionProps[] = [
    { 
        title: "10x Your gaming Content, Saving on average 100 hours every month", 
        description: "Frags handles clip selection virality ranking, and multi-platform publishing, so you can focus on what you do best - gaming.", 
        src: "assets/mission1.svg", 
        alt: "Mission 1" 
    },
    {
        title: "From epic plays to viral clips in seconds",
        description: "Harness AI to auto-segment your best moments, rank potential virality, and streamline your editing workflow across all platforms",
        src: "assets/mission2.svg",
        alt: "Mission 2"
    },
    {
        title: "Level up your game, not your workload",
        description: "Let frags handle the heavy lifting of clip selection, virality assessment, and cross-platform publishing while you conquer new gaming horizons",
        src: "assets/mission3.svg",
        alt: "Mission 3"
    },
]

export default function Mission() {

    return (
        <>
            <div className="flex flex-col gap-16 w-4/5 mx-auto mt-40">
                {missions.map((mission, index) => {
                    return (
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between items-center">
                            {index % 2 !== 0 && <div className="bg-[#1A1A1C] w-full lg:w-2/5 h-[600px] rounded-lg hidden lg:block" />}
                            <div className="flex flex-col items-start justify-center gap-5 lg:w-2/5">
                                <div className="text-3xl font-bold">{mission.title}</div>
                                <div className="text-xl">{mission.description}</div>
                                <Button className="text-xl rounded-full mt-8 px-8 py-6 outline-gray-200">
                                    Try For Free
                                </Button>
                            </div>
                            <div className="bg-[#1A1A1C] w-full lg:w-2/5 h-[600px] rounded-lg lg:hidden" />
                            {index % 2 === 0 && <div className="bg-[#1A1A1C] w-full lg:w-2/5 h-[400px] lg:h-[600px] rounded-lg hidden lg:block" />}
                        </div>
                    )
                })}
            </div>
        </>
    )
}
