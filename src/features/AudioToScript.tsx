import React, { useCallback, useRef, useState } from 'react';
import { uploadFile } from '../api/uploadFile'
import { getTranscript } from '../api/getTranscript';
import { getScript } from '../api/getScript';
import AudioRecordUploader from '../components/AudioRecordUploader';
import '../App.css';
import Loader from '../components/Loader';
import GeneratedScriptOutput from '../components/GeneratedScriptOutput';
import { ValidationError, errorLabels } from '../constants';

function AudioToScript() {
    const [error, setError] = useState<ValidationError | undefined>()
    const [uploading, setUploading] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [scriptRendered, setScriptRendered] = useState(false);
    const scriptContentRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const scriptText = useRef('');

    const openAICompletion = useCallback(async (transcript: string) => {
        const response = await getScript(transcript);
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
            setError(ValidationError.contextLimit)
            setUploading(false)
            setAnalysing(false)
            setLoaded(false)
            setScriptRendered(false)
        }
    }, [setLoaded, setScriptRendered])

    const handleScripting = useCallback(
        async (file: File) => {
            setUploading(true);
            const uploadedFileData = await uploadFile(file);
            setUploading(false);

            setAnalysing(true);
            const { transcript } = await getTranscript(uploadedFileData);

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
                    <Loader>
                        Uploading Call...
                    </Loader>
                )}
                {analysing && (
                    <Loader>
                        Analyzing Call...
                    </Loader>

                )}
                {!analysing && !uploading && loaded && (
                    <GeneratedScriptOutput
                        scriptRendered={scriptRendered}
                        onCopy={handleCopy}
                        scriptContentRef={scriptContentRef}
                        bottomRef={bottomRef}
                    />
                )}
            </div>
        </div>
    );
}

export default AudioToScript;
