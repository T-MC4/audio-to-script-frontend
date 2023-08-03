import axios from '../axios';
import { UploadedFileData } from './uploadFile';

export const getTranscript = async (data: UploadedFileData) => {
    const options = {
        method: 'POST',
        url: '/api/audio_recording/transcript',
        headers: {
            accept: 'application/json',
        },
        data
    };

    const result = await axios.request(options);
    return result.data;
}
