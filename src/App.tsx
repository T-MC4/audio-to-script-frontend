import React, { useCallback, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { uploadFile } from './api/uploadFile'
import './App.css';
import { getTranscript } from './api/getTranscript';
import { getScript } from './api/getScript';
import AudioRecordUploader from './AudioRecordUploader';

enum ValidationError {
    fileSize = 'fileSize',
    contextLimit = 'contextLimit'
}

const errorLabels = {
    [ValidationError.fileSize]: 'File size ololo todo',
    [ValidationError.contextLimit]: 'context-limit-exceeded',
} as const

function App() {
    const [error, setError] = useState<ValidationError | undefined>()
    const [uploading, setUploading] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [scriptRendered, setScriptRendered] = useState(false);
    const scriptDiv = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const scriptText = useRef('');

    const openAICompletion = useCallback(async (transcript: string) => {
        const response = await getScript(transcript);
        if (response.ok) {
            setLoaded(true)
            setError(undefined)

            scriptText.current = '';
            for (const reader = response.body!.getReader(); ;) {
                const { value, done } = await reader.read();

                if (done) {
                    console.log('DONE')
                    setScriptRendered(true);
                    break;
                }

                const chunk = new TextDecoder().decode(value);
                scriptText.current += chunk;
                console.log('chunk:', chunk)

                if (scriptDiv.current) {
                    scriptDiv.current.innerHTML = scriptText.current
                }
                if (bottomRef.current) {
                    bottomRef.current?.scrollIntoView();
                }
            }
        } else {
            setError(ValidationError.contextLimit)
            // TODO: display error in UI
            console.log('err')
        }
    }, [setLoaded, setScriptRendered])

    const handleScripting = useCallback(
        async (file: File) => {
            setUploading(true);
            const uploadedFileData = await uploadFile(file);
            setUploading(false);

            setAnalysing(true);
            const { transcript } = await getTranscript(uploadedFileData);
            setAnalysing(false);

            setScriptRendered(false);
            await openAICompletion(transcript);
        },
        [openAICompletion]
    );

    const handleCopy = useCallback(() => {
        if (scriptText.current) {
            navigator.clipboard.writeText(scriptText.current);
        } else {
            console.error('No data to copy');
        }
    }, [])

    return (
        <div className="App">
            <div className="container">
                {!uploading && !analysing && !loaded && (
                    <>
                        <AudioRecordUploader onUpload={handleScripting} onError={() => setError(ValidationError.fileSize)} />
                        {!!error && (<div className='text-red-600 mt-2'>{errorLabels[error]}</div>)}
                    </>
                )}
                {uploading && (
                    <>
                        <h2 className="text-3xl font-bold title">
                            Uploading Call...
                        </h2>
                        <div className="h-320px">
                            <div className="w-full p-4 h-full flex flex-col justify-center items-center">
                                <ClipLoader />
                            </div>
                        </div>
                    </>
                )}
                {analysing && (
                    <>
                        <h2 className="text-3xl font-bold title">
                            Analyzing Call...
                        </h2>
                        <div className="h-320px">
                            <div className="w-full p-4 h-full flex flex-col justify-center items-center">
                                <ClipLoader size={45} />
                            </div>
                        </div>
                    </>
                )}
                {!analysing && !uploading && loaded && (
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
                                <div
                                    className="Typewriter__wrapper"
                                    ref={scriptDiv}
                                ></div>
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
                                    onClick={handleCopy}
                                    className="flex justify-center rounded-md bg-indigo-600 px-6 py-1.5 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Copy Script
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
