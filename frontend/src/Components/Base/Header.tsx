import Icons from "@/components/icons"
import NavBar from "./NavBar"
import {motion, AnimatePresence} from "framer-motion"
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import MobileMenu from "./MobileMenu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const handleToggles = () => {
    toggleSidebar()
    toggleMobileMenu()
  }

  const handleSignIn = () => {
    localStorage.setItem("intendedDestination", location.pathname);
    navigate("/login");
  };

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-20 z-40"></div>
      )}
  
      <header className={`fixed top-0 w-full z-50 mx-auto px-4 flex flex-col py-4 bg-[#0f0f0f] text-white font-inter shadow-lg ${isMobileOpen ? 'backdrop-blur bg-opacity-90' : ''}`}>
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-4">
            <button id="sidebarToggle" className="lg:hidden transition duration-250 hover:scale-125 hover:text-gray-300" onClick={handleToggles}>
              {isMobileOpen ? <Icons.X size="30" /> : <Icons.AlignJustify size="30" />}
            </button>
  
            <Link to="/">
              <img src="../assets/Frame 50126812.png" alt="Frags Logo" className=""/>
            </Link>
          </div>
          <NavBar components={components} />
          <div className="flex items-center gap-5 text-white">
            {isSignedIn ? (
              <>
                <Link to="/profile" className="text-lg font-bold self-center hover:text-gray-300 transition duration-300 ease-in-out">
                  Profile
                </Link>
                <button onClick={handleSignOut} className="hidden md:block text-lg font-bold self-center hover:text-gray-300 transition duration-300 ease-in-out">
                  Signout
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSignIn} className="hidden md:block text-md font-bold self-center hover:text-gray-300 transition duration-300 ease-in-out">Login</button>
                <Link to="/signup" className="bg-white text-md text-black rounded-3xl px-4 py-1 hover:bg-gray-300 transition duration-300 ease-in-out">
                  Free Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div 
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0 } }}
            >
              <MobileMenu components={components} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;



