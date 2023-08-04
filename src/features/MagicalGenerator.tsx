import React, { useCallback, useRef, useState } from 'react';
import { uploadFile } from '../api/uploadFile'
import { getTranscript } from '../api/getTranscript';
import { getScript } from '../api/getScript';
import AudioRecordUploader from '../components/AudioRecordUploader';
import CopyPasteUploader from '../components/CopyPasteUploader';
import '../App.css';
import Loader from '../components/Loader';
import GeneratedScriptOutput from '../components/GeneratedScriptOutput';
import { Flow, TranscriptSource, ValidationError, errorLabels } from '../constants';
import Button, { ButtonType } from '../components/Button';
import Title from '../components/Title'
import getFinalizingScript from './getFinalizingScript';

type Props = {
    transcriptSource: TranscriptSource
    flow: Flow
}

function MagicalGenerator({ transcriptSource, flow }: Props) {
    const [error, setError] = useState<ValidationError | undefined>()
    const [uploading, setUploading] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [scriptRendered, setScriptRendered] = useState(false);
    const [finalizedScript, setFinalizedScript] = useState<string | undefined>()
    const [scriptCopied, setScriptCopied] = useState(false)
    const scriptContentRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const scriptText = useRef('');
    const lastTranscript = useRef('');

    const resetState = () => {
        setUploading(false);
        setAnalysing(false);
        setLoaded(false);
        setScriptRendered(false);
        setFinalizedScript(undefined);
        setScriptCopied(false);
    }

    const openAICompletion = useCallback(async (transcript: string) => {
        const response = await getScript(transcript, TranscriptSource.audioToScript);
        if (response.ok) {
            setAnalysing(false);
            setLoaded(true)
            setError(undefined)

            scriptText.current = '';
            for (const reader = response.body!.getReader(); ;) {
                const { value, done } = await reader.read();

                if (done) {
                    setScriptRendered(true);
                    break;
                }

                const chunk = new TextDecoder().decode(value);
                scriptText.current += chunk;

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

    const handleAudioScripting = useCallback(
        async (file: File) => {
            try {
                setUploading(true);
                const uploadedFileData = await uploadFile(file);
                setUploading(false);

                setAnalysing(true);
                const { transcript } = await getTranscript(uploadedFileData);
                lastTranscript.current = transcript;
                setScriptRendered(false);
                await openAICompletion(transcript);
            } catch (err) {
                resetState();
                setError(ValidationError.default)
            }
        },
        [openAICompletion]
    );

    const handleCopyPasteScripting = async (originalScript: string) => {
        lastTranscript.current = originalScript;
        setScriptRendered(false);
        await openAICompletion(originalScript);
    }

    const handleReGenerate = useCallback(async () => {
        setAnalysing(true);
        setScriptRendered(false);
        await openAICompletion(lastTranscript.current);
    }, [openAICompletion])

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(finalizedScript!);
        setScriptCopied(true);
    }, [finalizedScript])

    const handleFinalizeScript = () => {
        setFinalizedScript(getFinalizingScript(scriptText.current, flow))
    }

    const showUploader = !uploading && !analysing && !loaded;
    const showScriptOutput = !uploading && !analysing && loaded;

    return (
        <div className="App">
            {showUploader && (
                <>
                    {transcriptSource === TranscriptSource.audioToScript && (
                        <AudioRecordUploader onUpload={handleAudioScripting} onError={() => setError(ValidationError.fileSize)} />
                    )}

                    {transcriptSource === TranscriptSource.copyPasteToScript && (
                        <CopyPasteUploader onSubmit={handleCopyPasteScripting} />
                    )}
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
                    Analyzing {transcriptSource === TranscriptSource.audioToScript ? 'Call' : 'Script'}...
                </Loader>
            )}
            {showScriptOutput && (
                <>
                    <Title>
                        {transcriptSource === TranscriptSource.audioToScript ? (
                            scriptRendered ? 'Cloning Successful! Copy Your Script Below' : 'Cloning Your Best Rep...'
                        ) : (
                            scriptRendered ? 'Reformat Completed! Copy Your Script Below' : 'Reformatting Your Script...'
                        )}
                    </Title>
                    {!finalizedScript && (
                        <GeneratedScriptOutput>
                            <div className='whitespace-pre-line' ref={scriptContentRef} />
                            <div ref={bottomRef} />
                        </GeneratedScriptOutput>
                    )}
                    {finalizedScript && (
                        <GeneratedScriptOutput>
                            <div className='whitespace-pre-line'>{finalizedScript}</div>
                        </GeneratedScriptOutput>
                    )}
                    <div className="w-full flex justify-center mt-4 gap-x-6">
                        {!finalizedScript && (
                            <>
                                <Button
                                    disabled={!scriptRendered}
                                    type={ButtonType.secondary}
                                    onClick={handleReGenerate}
                                >
                                    Regenerate Script
                                </Button>
                                <Button
                                    disabled={!scriptRendered}
                                    onClick={handleFinalizeScript}
                                >
                                    Looks Done! Go To Next Step
                                </Button></>
                        )}
                        {!!finalizedScript && (
                            <Button
                                disabled={scriptCopied}
                                onClick={handleCopy}
                            >
                                {flow === Flow.standardScriptOnly ? (
                                    scriptCopied ? 'Script Copied!' : 'Copy Script'

                                ) : (
                                    scriptCopied ? 'Prompt And Script Copied!!' : 'Copy Prompt And Script'
                                )}
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default MagicalGenerator;
