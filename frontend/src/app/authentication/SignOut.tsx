import { useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

export const SignOut: React.FC = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const {isPending, error, data} = useQuery({
        queryKey: ["signOut"],
        queryFn: () => signOut().then(() => {
            navigate("/");
        })
    })

    if (isPending) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-white">
                <p>Signing you out...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-white">
                <p>There was an error signing you out.</p>
            </div>
        );
    }
}

export default SignOut;