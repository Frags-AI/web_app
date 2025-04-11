import Icons from "@/components/icons"
import { Button } from "@/components/ui/button"

interface HeaderProps {
    className?: string
}

export default function Header({className}: HeaderProps) {
    return (
        <div className={`h-[60px] flex mt-4 z-30 ml-[4.5em] ${className ? className : ""}`}>   
            <div className="flex gap-10 w-full justify-end mx-8 py-3 ">
                <div className="flex items-center">
                    <Icons.Bell size={20}/>
                </div>
                <div className="flex gap-1 items-center">
                    <Icons.Zap size={20} fill="#d4b455" color="#d4b455"/>
                    <div>60</div>
                </div>
                <Button className="bg-primary/90 hover:bg-primary/80 font-bold transition duration-300 px-3 py-1 rounded-lg">
                    Add more credits
                </Button>
            </div>
        </div>
    )
}