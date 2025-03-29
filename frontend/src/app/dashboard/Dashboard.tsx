import Sidebar from "./Sidebar"
import Header from "./Header"
import AIChat from "./AIButton"
import Container from "./Container"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {

  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="w-screen flex flex-col relative" style={{ height: "100dvh" }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="fixed top-0 left-0 h-full" sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}/>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Container sidebarExpanded={sidebarExpanded}/>
          </div>
      </div>
      <AIChat />
    </div>
  )
}