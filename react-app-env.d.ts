declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_SUPABASE_URL: string;
        REACT_APP_SUPABASE_PUBLIC_KEY: string;
        REACT_APP_SUPABASE_BUCKET_NAME: string;
        REACT_APP_SUPABASE_FOLDER_NAME: string;
    }
}