import { TranscriptSource } from '../constants'
const baseUrl = process.env.REACT_APP_API_SERVER

export const getScript = (transcript: string, transcript_source: TranscriptSource) =>
    fetch(`${baseUrl}/api/script/generate`, {
        method: "POST",
        headers: {
            "Accept": "text/event-stream",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            transcript: transcript,
            transcript_source: transcript_source
        }),
    });

