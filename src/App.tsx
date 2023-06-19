import React, { useCallback, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { ClipLoader } from 'react-spinners';
// import TypewriterComponent from 'typewriter-effect';
import axios from './axios';
import UploadIcon from './assets/upload_icon.png';
import './App.css';

const fileTypes = ['WAV', 'MP3', 'MP4', 'WEBM'];

function App() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const [eventData, setEventData] = useState('');
    // const [script, setScript] = useState('');
    const [scriptRendered, setScriptRendered] = useState(false);
    const handleChange = (file: File) => {
        setFile(file);
    };
    console.log(file);

    const uploadFile = useCallback(async (file: File) => {
        console.log('API server #1: ', process.env.REACT_APP_API_SERVER);
        console.log(axios.defaults.baseURL);
        if (file) {
            const fromData = new FormData();
            fromData.append('record', file!);
            const options = {
                method: 'POST',
                url: '/api/upload_record',
                headers: {
                    accept: 'application/json',
                },
                data: fromData,
            };

            const result = await axios.request(options);
            console.log(result.data.file_name);
            return result.data.file_name; // return file_name instead of result.data
        }
    }, []);

    const deepgramProcessing = useCallback(async (fileName: any) => {
        console.log('API server #2: ', process.env.REACT_APP_API_SERVER);
        console.log(axios.defaults.baseURL);

        if (fileName) {
            const options = {
                method: 'POST',
                url: '/api/get_transcript',
                headers: {
                    accept: 'application/json',
                },
                data: { file_name: fileName }, // send file_name as the body
            };

            const result = await axios.request(options);
            console.log(result.data);

            return result.data.file_name;
        }
    }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

    const openAICompletion = useCallback(
        (
            fileName: string,
            setOrCloseCall?: string,
            generateSingleSpeakerFiles?: boolean,
            useSingleSpeakerText?: boolean,
            useContinue?: boolean
        ) => {
            if (fileName) {
                const url = new URL(
                    `${process.env.REACT_APP_API_SERVER}/api/get_script`
                );

                url.search = new URLSearchParams({
                    fileName: fileName,
                    // setOrCloseCall: setOrCloseCall || 'close',
                    // generateSingleSpeakerFiles:
                    //  s   String(generateSingleSpeakerFiles) || 'true',
                    // useSingleSpeakerText:
                    //     String(useSingleSpeakerText) || 'true',
                    // useContinue: String(useContinue) || 'true',
                }).toString();

                const eventSource = new EventSource(url.toString());

                eventSource.onmessage = (event) => {
                    const result = JSON.parse(event.data);
                    console.log(result);

                    // Append new data to the existing string
                    setEventData((prevData) => prevData + result);

                    // If the process is done, close the connection
                    if (result.done) {
                        eventSource.close();
                    }
                };

                return eventSource;
            }
        },
        [] // Empty dependency array means this effect runs once on mount and clean up on unmount
    );

    const handleScripting = useCallback(
        async (file: File) => {
            const fileName: string = await uploadFile(file);
            console.log('fileName: ', fileName);
            setUploading(false);

            setAnalysing(true);
            await deepgramProcessing(fileName);
            setAnalysing(false);
            // setEventData('true');

            setScriptRendered(false);
            openAICompletion(fileName);
            // openAICompletion(fileName, 'close', true, true, true);
            setScriptRendered(true);
        },
        [uploadFile, deepgramProcessing, openAICompletion]
    );

    const handleCopy = useCallback(async () => {
        const dataToCopy =
            typeof eventData === 'object'
                ? JSON.stringify(eventData, null, 2)
                : eventData;
        if (dataToCopy) {
            await navigator.clipboard.writeText(dataToCopy);
        } else {
            console.error('No data to copy');
        }
    }, [eventData]);

    useEffect(() => {
        if (file) {
            handleScripting(file).catch(console.error);
        }
    }, [file, handleScripting]);

    return (
        <div className="App">
            <div className="container">
                {!uploading && !analysing && !eventData && (
                    <>
                        <h2 className="text-3xl font-bold mb-4 title">
                            Upload A Call Recording
                        </h2>
                        <p className="mb-8">
                            Clone your best rep by uploading a call recording
                            from them and we'll magically create a script for
                            your Air Agent to follow based on it.{' '}
                        </p>
                        <div className="h-320px">
                            <FileUploader
                                handleChange={handleChange}
                                name="file"
                                types={fileTypes}
                            >
                                <div className="w-full text-center border border-dotted border-black rounded-xl p-4 h-full flex flex-col justify-center items-center cursor-pointer">
                                    <img
                                        src={UploadIcon}
                                        width={32}
                                        className="mb-4"
                                        alt="upload-icon"
                                    />
                                    <p>Click to upload audio from computer</p>
                                    <p className="text-gray-500">
                                        or drag and drop here
                                    </p>
                                </div>
                            </FileUploader>
                        </div>
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
                {!analysing && !uploading && eventData && (
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
                                {!scriptRendered && (
                                    <div
                                        className="Typewriter__wrapper"
                                        dangerouslySetInnerHTML={{
                                            __html: eventData,
                                        }}
                                    ></div>
                                    // <TypewriterComponent
                                    //     onInit={(typewriter) => {
                                    //         typewriter
                                    //             .typeString(script)
                                    //             .callFunction(() => {
                                    //                 setScriptRendered(true);
                                    //             })
                                    //             .start();
                                    //     }}
                                    //     options={{
                                    //         delay: 20,
                                    //     }}
                                    // />
                                )}
                                {scriptRendered && (
                                    <div
                                        className="Typewriter__wrapper"
                                        dangerouslySetInnerHTML={{
                                            __html: eventData,
                                        }}
                                    ></div>
                                )}
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
