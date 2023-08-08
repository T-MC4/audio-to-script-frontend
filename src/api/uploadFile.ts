import { nanoid } from 'nanoid'
import supabase from '../supabase';
import { ValidationError } from '../constants';

export const uploadFile = async (file: File) => {
    try {
        const fileExtension = file.name.split('.').pop() || '';
        const { error, data } = await supabase
            .storage
            .from(process.env.REACT_APP_SUPABASE_BUCKET_NAME)
            .upload(`${process.env.REACT_APP_SUPABASE_FOLDER_NAME}/${nanoid()}.${fileExtension}`, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            throw new Error(ValidationError.uploadFile);
        }
        return data.path;
    } catch (error) {
        throw new Error(ValidationError.uploadFile);
    }
}