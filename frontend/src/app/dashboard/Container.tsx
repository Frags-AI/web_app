import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { SubscriptionDataProps } from "@/types"
import { getSubscriptionData } from "./globalsHelpers"
import { useAuth } from "@clerk/clerk-react"

interface ContainerProps {
    sidebarExpanded: boolean
    children?: React.ReactNode
}

export default function Container({sidebarExpanded, children}: ContainerProps) {
    const { getToken } = useAuth()

    useQuery<SubscriptionDataProps>({
      queryKey: ["subscriptionData"],
      queryFn: async () => {
        const token = await getToken()
        return getSubscriptionData(token)
      },
      staleTime: 3600
    })
    
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