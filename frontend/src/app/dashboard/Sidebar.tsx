import Icons from "@/components/icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/clerk-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faHouse, faFolderClosed, faCrown, faCalendar, faChartSimple, faLink, faBars, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import { IconProps, IconPropsGroup } from "@/types"
import { useNavigate } from "react-router-dom";


interface SidebarProps {
    className?: string
    sidebarExpanded?: boolean
    setSidebarExpanded?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({className, sidebarExpanded, setSidebarExpanded}: SidebarProps) {
  const navigate = useNavigate();
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handeHoverEnter = (id: string) => {
    setHoveredId(id)
  }

  const handleHoverLeave = () => {
    setHoveredId(null)
  }

  const handleExpansion = () => {
    setIsExpanded(!isExpanded)
    if (setSidebarExpanded) {
      setSidebarExpanded(!isExpanded)
    }
  }

  const Group1: IconProps[] = [
    { icon: faHouse, label: "Home", id: "sidebar-home", tab: "" },
    { icon: faBars, label: "Creator Studio", id: "sidebar-studio", tab: "/studio" },
    { icon: faFolderClosed, label: "Asset Library", id: "sidebar-files", tab: "/library" },
  ]

  const Group2: IconProps[] = [
    { icon: faCalendar, label: "Calendar", id: "sidebar-calendar", tab: "/calendar" },
    { icon: faChartSimple, label: "Analytics", id: "sidebar-analytics", tab: "/analytics" },
    { icon: faLink, label: "Social", id: "sidebar-social", tab: "/social" },
  ]

  const Group3: IconProps[] = [
    { icon: faCrown, label: "Subscriptions", id: "sidebar-subscriptions", tab: "/subscriptions" },
    { icon: faBookOpen, label: "Learning Center", id: "sidebar-learning-center", tab: "/learning-center" },
    { icon: faCircleQuestion, label: "Help Center", id: "sidebar-help-center", tab: "/help-center" },
  ]

  const IconGroups : IconPropsGroup[] = [
    { title: "Create", items: Group1 },
    { title: "Manage", items: Group2 },
    { title: "Explore", items: Group3 },
  ]

  const location = useLocation()
  const currentPath = location.pathname
  const currentTab = currentPath.split("/dashboard").pop() 

  const selectedTabStyle = "bg-zinc-800 border border-zinc-700 hover:bg-zinc-800"
  const unselectedTabStyle = "hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700"

  return (
    // Sidebar
    <motion.div 
      className={`p-3 bg-[#050406]  border-r mr-8 ${className} ${isExpanded ? "z-40": "z-30"}`}
      initial={{ width: "4.5rem" }}
      animate={{ width: isExpanded ? "12em" : "4.5rem" }}
    >
      <div className="flex items-center h-full w-full flex-col gap-2 flex-1">
        <div className={`flex gap-2 w-full items-center ${isExpanded ? "" : "justify-end"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0}}
            transition={{ duration: 0.3 }}
            className={`hover:cursor-pointer`}
            onClick={() => window.location.href = "/"}
          >
            <img src="../assets/frags_logo.svg" alt="Frags Logo" className="cover" />
          </motion.div>
          <Button className="bg-[#050406] hover:bg-zinc-800  border w-full" onClick={handleExpansion}>
            <motion.div
              initial={{rotate: 0}}
              animate={{rotate: isExpanded ? 180 : 0}}
              transition={{ duration: 0.3 }}
            >
              <Icons.ArrowRightToLine />
            </motion.div>
          </Button>
        </div>
        <div className="flex w-full mt-4">
          <Button className="bg-[#050406] hover:bg-zinc-800  border flex flex-col w-full">
              <UserButton />
          </Button>
        </div>
        {IconGroups.map((group, idx) => (
          <>
            {idx === IconGroups.length - 1 && <div className="grow"/>}
            <div className="flex flex-col mt-16 w-full">
                <AnimatePresence>
                    <motion.div
                        className="text-zinc-400"
                        initial={{opacity: 0, x: -10}}
                        animate={{opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10}}
                        transition={{ duration: 0.3 }}
                    >
                        {group.title}
                    </motion.div>
                </AnimatePresence>
                {group.items.map((item, index) => (
                <div 
                    className="flex items-center justify-between gap-2" 
                    key={item.id}
                    onMouseEnter={() => handeHoverEnter(item.id)}
                    onMouseLeave={handleHoverLeave}
    
                >
                  <Button 
                    onClick={() => navigate(`/dashboard${item.tab}`)}
                    className={`flex justify-start gap-2 bg-transparent  ${currentTab === item.tab ? selectedTabStyle : unselectedTabStyle} mb-2 w-full`}     
                  >
                      <FontAwesomeIcon 
                          icon={item.icon} 
                          size="xl" 
                          className="" 
                      />
                      <AnimatePresence>
                          {isExpanded && (
                          <motion.div 
                              className="text-zinc-300 font-bold"
                              initial={{opacity: 0, x: -10}}
                              animate={{opacity: 1, x: 0}}
                              transition={{ duration: 0.3 }}
                              exit={{opacity: 0, x: -10}}
                          >
                              {item.label}
                          </motion.div>
                          )}
                      </AnimatePresence>
                  </Button>
                  <AnimatePresence>
                    {hoveredId === item.id && !isExpanded && (
                      <motion.div
                        className="text-xs font-semibold ml-2 z-50 text-nowrap bg-white text-secondary py-1 px-2 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
    </motion.div>
  )
}