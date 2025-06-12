import Icons from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"

interface HeaderProps {
    className?: string
}

export default function Header({className}: HeaderProps) {
    const [name, setName] = useState<string>("")
    const user = useUser()

    useEffect(() => {
        setName(user.user.fullName)
    })
    

    return (
        <div className={`h-[60px] flex mt-4 z-30 ml-[4.5em] ${className ? className : ""}`}>   
            <div className="flex gap-10 w-full justify-center mx-8 py-3 ">
                <div className="font-bold text-lg">
                    Welcome {name}
                </div>
                <div className="flex items-center gap-8">
                    <ModeToggle/>
                    {/* <Button className="bg-primary/90 hover:bg-primary/80 font-bold transition duration-300 px-3 py-1 rounded-lg">
                        Add more credits
                    </Button> */}
                </div>
            </div>
        </div>
    )
}