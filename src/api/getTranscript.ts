import axios from '../axios';

export const getTranscript = async (filePath: string): Promise<{ transcript: string }> => {
    const options = {
        method: 'POST',
        url: '/api/transcripts',
        headers: {
            accept: 'application/json',
        },
        data: { file_path: filePath }
    };

    const result = await axios.request(options);
    return result.data;
}
