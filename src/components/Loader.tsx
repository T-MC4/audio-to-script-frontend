import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <h2 className="text-3xl font-bold title">
                {children}
            </h2>
            <div className="h-320px">
                <div className="w-full p-4 h-full flex flex-col justify-center items-center">
                    <ClipLoader size={45} />
                </div>
            </div>
        </>
    )
}

export default Loader;