import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Icons from "../../components/icons"
import { Link } from "react-router-dom"
import { ListItemGroupProps } from "@/types"

interface MenuBarProps {
    components: ListItemGroupProps[]
}

const MobileMenu: React.FC<MenuBarProps> = ({ components }) => {
    const [isOpenIdx, setIsOpenIdx] = React.useState<number>(-1)

    const handleOpenChange = (idx: number) => {
        if (open) {
            setIsOpenIdx(isOpenIdx === idx ? -1 : idx)
        }
    }
  
    return (
      <div className="flex flex-col lg:hidden px-3 mt-3">
        {components.map((component, idx) => (
            <Collapsible
              open={isOpenIdx === idx}
              onOpenChange={open => handleOpenChange(idx)}
              className="flex flex-col flex-1 mb-3 border-b border-gray-600"
            >
                <>
                  <CollapsibleTrigger className="flex flex-1 justify-between items-center">
                    <div className="text-xl font-bold mb-3">{component.title}</div>
                    <motion.div animate={{ rotate: isOpenIdx === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <Icons.ChevronDown />
                    </motion.div>
                  </CollapsibleTrigger>
                  <AnimatePresence initial={false}>
                    {isOpenIdx === idx && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0 } }}
                        className="flex flex-col"
                      >
                        {component.items.map((item) => (
                            <div className="flex flex-col mb-2 px-2">
                                <Link to={item.href}>
                                    <div className="text-base">{item.title}</div>
                                    <div className="text-xs text-gray-400">{item.description}</div>
                                </Link>
                            </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
            </Collapsible>
        ))}

      </div>
    )
  }
  
  export default MobileMenu