import { useState, useRef, useEffect, FormEventHandler } from "react";
import { animate, useMotionValue, motion } from "framer-motion";

interface CarouselProps {
    src: string
}

const videoCards: CarouselProps[] = [
    { src: "https://www.youtube.com/embed/6ZfuNTqbHE8" }, // Avengers: Infinity War
    { src: "https://www.youtube.com/embed/8ugaeA-nMTc" }, // Bohemian Rhapsody
    { src: "https://www.youtube.com/embed/EXeTwQWrcwY" }, // The Dark Knight
    { src: "https://www.youtube.com/embed/2e-eXJ6HgkQ" }, // Interstellar
    { src: "https://www.youtube.com/embed/YoHD9XEInc0" }, // Inception
    { src: "https://www.youtube.com/embed/s7EdQ4FqbhY" }, // The Social Network
    { src: "https://www.youtube.com/embed/grL4JMs1up0" }, // Fight Club
    { src: "https://www.youtube.com/embed/zSWdZVtXT7E" }, // The Martian
    { src: "https://www.youtube.com/embed/V75dMMIW2B4" }, // Ready Player One
    { src: "https://www.youtube.com/embed/uYPbbksJxIg" }, // Oppenheimer
    { src: "https://www.youtube.com/embed/qSu6i2iFMO0" }, // Sonic the Hedgehog 3
    { src: "https://www.youtube.com/embed/_Z3QKkl1WyM" }, // Doctor Strange
    { src: "https://www.youtube.com/embed/TcMBFSGVi1c" }, // Avengers: Endgame
    { src: "https://www.youtube.com/embed/5PSNL1qE6VY" }, // Avatar
    { src: "https://www.youtube.com/embed/2LqzF5WauAw" }, // Top Gun: Maverick
    { src: "https://www.youtube.com/embed/8g18jFHCLXk" }, // Blade Runner 2049
    { src: "https://www.youtube.com/embed/1roy4o4tqQM" }, // Detective Pikachu
    { src: "https://www.youtube.com/embed/t433PEQGErc" }, // The Lion King (2019)
    { src: "https://www.youtube.com/embed/JfVOs4VSpmA" }, // Spider-Man: No Way Home
    { src: "https://www.youtube.com/embed/qSqVVswa420" }, // Fast & Furious 9
];  

export default function Carousel() {

    const SLOW_DURATION = 300
    const NORMAL_DURATION= 200
    const FAST_DURATION = 50

    const [mustFinish, setMustFinish] = useState(false)
    const [rerender, setRerender] = useState(false)
    const [duration, setDuration] = useState(NORMAL_DURATION)
    const container = useRef<HTMLDivElement>(null)
    const xTranslation = useMotionValue(0)

    useEffect(() => {
        let endPosition = -container.current?.scrollWidth / 2
        let controls

        if (mustFinish) {
            controls = animate(xTranslation, [xTranslation.get(), endPosition], {
                ease: "linear",
                duration: duration * (1 - xTranslation.get() / endPosition),
                onComplete: () => {
                    setMustFinish(false)
                    setRerender(!rerender)
                }
            })

        } else {
            controls = animate(xTranslation, [0, endPosition], {
                ease: "linear",
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0
            })
        }

        return controls.stop
    }, [xTranslation, duration, container?.current?.scrollWidth, rerender])

    const handleHoverStart = () => {
        setMustFinish(true)
        setDuration(SLOW_DURATION)
    }

    const handleHoverEnd = () => {
        setMustFinish(true)
        setDuration(NORMAL_DURATION)
    }

    return (
        <div className="mt-40 px-10">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="font-bold text-4xl lg:text-6xl">Better. Faster. Smarter.</div>
                <div className="text-muted-foreground lg:text-lg">Frag's AI tools help you create content more effectively and efficiently</div>
            </div>
            <div className="relative w-full h-full overflow-x-hidden justify-center">
                <motion.div 
                    className="relative h-[500px] mx-12 my-10 flex no-scrollbar translate" 
                    ref={container}
                    style={{ x: xTranslation }}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                >
                    {/* You'll need to change this later to work with the assets folder or create a demo library of shorts */}
                    {[...videoCards, ...videoCards].map((card, index) => (
                    <div key={index} className="cursor-pointer w-[300px] h-full shrink-0 bg-transparent mx-4 rounded-3xl flex flex-col items-center items-center justify-center">
                        <video src={card.src} controls autoPlay className="w-full h-full object-cover rounded-3xl"/>
                    </div>
                    ))}
                </motion.div>
                <div className="pointer-events-none left-0 top-0 absolute w-10 h-full bg-linear-to-r from-background via-background/70 to-background/10 z-10"/>
                <div className="pointer-events-none right-0 top-0 absolute w-10 h-full bg-linear-to-l from-background via-background/70 to-background/10 z-10"/>
            </div>
        </div>
    );
}