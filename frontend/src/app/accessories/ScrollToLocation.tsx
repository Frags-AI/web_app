import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom'

interface ScrollToTopProps {
    children: React.ReactNode
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({children}) => {
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location])

    return children
}

export default ScrollToTop