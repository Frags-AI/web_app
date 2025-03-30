import { motion } from "framer-motion"

interface ContainerProps {
    sidebarExpanded: boolean
    children?: React.ReactNode
}

export default function Container({sidebarExpanded, children}: ContainerProps) {

    return (
        <motion.div 
            className="flex flex-col gap-4 p-4"
            initial={{ marginLeft: "4.5em" }}
            animate={{ marginLeft: sidebarExpanded ? "12em" : "4.5em" }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div> 
    )
}