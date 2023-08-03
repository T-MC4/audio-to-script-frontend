import React from 'react';

type Props = {
    scriptRendered: boolean;
    onCopy: () => void;
    scriptContentRef: React.RefObject<HTMLDivElement>
    bottomRef: React.RefObject<HTMLDivElement>
}

const GeneratedScriptOutput = ({ scriptRendered, onCopy, scriptContentRef, bottomRef }: Props) => (
    <>
        {!scriptRendered && (
            <h2 className="text-3xl font-bold title">
                Cloning Your Best Rep...
            </h2>
        )}
        {scriptRendered && (
            <h2 className="text-2xl font-bold title">
                Cloning Successful! Copy Your Script Below
            </h2>
        )}
        <div className="h-320px w-full mt-8">
            <div className="w-full text-left border border-solid border-black rounded-xl p-4 h-full flex flex-col justify-start items-start overflow-auto">
                <div className='whitespace-pre-line' ref={scriptContentRef} />
                <div ref={bottomRef} />
            </div>
        </div>
        <div className="w-full flex justify-center mt-4">
            {!scriptRendered && (
                <button
                    disabled
                    className="flex justify-center rounded-md bg-gray-600 px-6 py-1.5 leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                    Copy Script
                </button>
            )}
            {scriptRendered && (
                <button
                    onClick={onCopy}
                    className="flex justify-center rounded-md bg-indigo-600 px-6 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Copy Script
                </button>
            )}
        </div>
    </>
)

export default GeneratedScriptOutput;
