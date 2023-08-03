import React, { useCallback, useRef, useState } from 'react';
import '../App.css';
import { ValidationError, errorLabels } from '../constants';
import { getScript } from '../api/getScript';
import Loader from '../components/Loader';
import GeneratedScriptOutput from './GeneratedScriptOutput';

const ScriptToFormattedScript = () => {
    const [originalScript, setOriginalScript] = useState('')
    const [error, setError] = useState<ValidationError | undefined>()
    const [analysing, setAnalysing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [scriptRendered, setScriptRendered] = useState(false);
    const scriptContentRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const scriptText = useRef('');

    const openAICompletion = useCallback(async () => {
        setAnalysing(true);
        const response = await getScript(originalScript);
        if (response.ok) {
            setAnalysing(false);
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

                if (scriptContentRef.current) {
                    scriptContentRef.current.innerHTML = scriptText.current
                }
                if (bottomRef.current) {
                    bottomRef.current?.scrollIntoView();
                }
            }
        } else {
            console.log(response)
            setError(ValidationError.contextLimit)
            setAnalysing(false)
            setLoaded(false)
            setScriptRendered(false)
        }
    }, [setLoaded, setScriptRendered, originalScript])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setOriginalScript(e.target.value);

    };

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
                {!analysing && !loaded && (
                    <>
                        <h2 className='text-4xl font-bold mb-4 title'>Upload Your Script</h2>
                        <p className='mb-8 px-20'>Upload your script and we'll automatically clean it up to make it much easier for your Air Agent to understand and follow.</p>
                        <textarea className='h-320px w-full border border-custom-color border-black rounded-xl p-4' value={originalScript} onChange={handleChange} placeholder='Copy and paste your original script here that you want to clean up...' />
                        <div className='w-full flex justify-center mt-4'>
                            {
                                !originalScript.length && (
                                    <button disabled className="flex justify-center rounded-md bg-gray-400 px-6 py-1.5 leading-6 text-white shadow-md hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400">Next Step</button>
                                )
                            }
                            {
                                originalScript.length > 0 && (
                                    <button onClick={openAICompletion} className="flex justify-center rounded-md bg-blue-600 px-6 py-1.5 leading-6 text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Next Step</button>
                                )
                            }
                        </div>
                        {!!error && (<div className='text-red-600 mt-2'>{errorLabels[error]}</div>)}
                    </>
                )}
                {analysing && (
                    <Loader>
                        Analyzing Script...
                    </Loader>

                )}
                {!analysing && loaded && (
                    <GeneratedScriptOutput
                        scriptRendered={scriptRendered}
                        onCopy={handleCopy}
                        scriptContentRef={scriptContentRef}
                        bottomRef={bottomRef}
                    />
                )}
            </div>
        </div>)
}

export default ScriptToFormattedScript;
