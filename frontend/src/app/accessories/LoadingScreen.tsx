import React, { useEffect, useState } from 'react';
import Icons from '@/components/icons';

const LoadingScreen: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 5 ? '' : prev + '.'));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-black text-white">
            <Icons.Loader2 className="w-32 h-32 animate-spin text-gray-300" />
            <div className="text-4xl mt-4 font-semibold tracking-wide">
                Loading{dots}
            </div>
        </div>
    );
};

export default LoadingScreen;