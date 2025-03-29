import { motion } from "framer-motion"

interface ContainerProps {
    sidebarExpanded: boolean
}

export default function Container({sidebarExpanded}: ContainerProps) {

    return (
        <motion.div 
            className="flex flex-col gap-4 p-4"
            initial={{ marginLeft: "4.5em" }}
            animate={{ marginLeft: sidebarExpanded ? "12em" : "4.5em" }}
            transition={{ duration: 0.3 }}
        >
            {[...Array(25)].map((_, i) => (
            <div key={i} className="">
                sdfasd
            </div>
            ))}
        </motion.div> 
    )
}