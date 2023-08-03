import axios from '../axios';

export type UploadedFileData = { file_name: string; mimetype: string }

export const uploadFile: (file: File) => Promise<UploadedFileData> = async (file) => {
    const fromData = new FormData();
    fromData.append('record', file);
    const options = {
        method: 'POST',
        url: '/api/audio_recording/upload',
        headers: {
            accept: 'application/json',
        },
        data: fromData,
    };
    const result = await axios.request(options);
    return result.data;
}