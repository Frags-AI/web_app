import Icons from "@/components/icons"
import NavBar from "./NavBar"
import {motion, AnimatePresence} from "framer-motion"
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import MobileMenu from "./MobileMenu";
import { ListItemProps, ListItemGroupProps } from "@/types";
import { ModeToggle } from "@/components/mode-toggle";

const resourceComponents: ListItemProps[] = [
  {
    title: "Blog",
    href: "/blog",
    description: "Find news, updates, and articles on the latest in gaming.",
  },
  {
    title: "Affiliates Program",
    href: "/affiliates",
    description: "Earn 20% on every sale you refer to us.",
  },
  {
    title: "Community Discord",
    href: "/community",
    description: "Join our community and get support from professionals.",
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with us for any inquiries."
  },
  {
    title: "Guides",
    href: "/guides",
    description: "Learn how to get started with our products."
  }
]

const featuresComponent: ListItemProps[] = [
  {
    title: "Virality Ranking",
    href: "/features/virality-ranking",
    description: "Get detailed insights on video performance and its potential for virality."
  },
  {
    title: "Stream Clipping",
    href: "/features/stream-clipping",
    description: "Easily extract and save the most exciting moments from your streams."
  },
  {
    title: "Aspect Ratio",
    href: "/features/aspect-ratio",
    description: "Optimize video dimensions to perfectly fit various social media platforms."
  },
  {
    title: "AI Subtitles",
    href: "/features/ai-subtitles",
    description: "Automatically generate accurate and professional AI-powered subtitles."
  },
  {
    title: "Video Assets",
    href: "/features/video-assets",
    description: "Access a comprehensive library of high-quality video assets for your projects."
  },
  {
    title: "Content Analysis",
    href: "/features/content-analysis",
    description: "Leverage AI insights to analyze and improve your video content's engagement."
  },
  {
    title: "In-Built Editor",
    href: "/features/in-built-editor",
    description: "Edit your videos seamlessly with our intuitive and powerful editor."
  },
  {
    title: "AI Backgrounds",
    href: "/features/ai-backgrounds",
    description: "Create stunning visuals with AI-generated backgrounds for your videos."
  },
  {
    title: "AI Voiceover",
    href: "/features/ai-voiceover",
    description: "Produce high-quality voiceovers using advanced AI technology."
  },
  {
    title: "Script Generator",
    href: "/features/script-generator",
    description: "Generate compelling and creative scripts for storytelling with AI assistance."
  }
];

const componentGroups: ListItemGroupProps[] = [
  {
    title: "Resources",
    items: resourceComponents,
  },
  // {
  //   title: "Features",
  //   items: featuresComponent
  // }
]

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => {
      if (isMobileOpen && e.clientY > headerRef.current?.clientHeight!) {
        setIsMobileOpen(false);
      }
    })
  
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
      }
    }) 
  }, [isMobileOpen])

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-20 z-40"></div>
      )}
  
      <header className={`fixed top-0 w-full z-50 mx-auto px-4 bg-background flex flex-col py-4 shadow-primary-invert shadow-md ${isMobileOpen ? 'backdrop-blur bg-opacity-90' : ''}`} ref={headerRef}>
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-4">
            <button id="sidebarToggle" className="lg:hidden transition duration-250 hover:scale-125 hover:text-muted-foreground" onClick={handleToggles}>
              {isMobileOpen ? <Icons.X size="30" /> : <Icons.AlignJustify size="30" />}
            </button>
  
            <Link to="/">
              <img src="../assets/frags_logo_dark.svg" alt="Frags Logo" className="dark:invert"/>
            </Link>
          </div>
          <NavBar components={componentGroups} />
          <div className="flex items-center gap-5">
            <ModeToggle />
            <SignedIn>
              <Link to="/profile" className="text-lg font-bold self-center hover:text-muted-foreground transition duration-300 ease-in-out">
                Profile
              </Link>
              <Link to="/dashboard" className="hidden md:block text-lg font-bold self-center hover:text-muted-foreground transition duration-300 ease-in-out">
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <button onClick={handleSignIn} className="hidden md:block text-md font-bold self-center hover:text-muted-foreground transition duration-300 ease-in-out">Login</button>
              <Link to="/signup" className="bg-primary text-primary-foreground text-md rounded-3xl px-4 py-1 hover:bg-primary/90 transition duration-300 ease-in-out font-bold">
                Free Sign Up
              </Link>
            </SignedOut>
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
              <MobileMenu components={componentGroups} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
