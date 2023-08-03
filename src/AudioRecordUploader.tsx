import React from 'react';
import { FileUploader } from 'react-drag-drop-files';
import UploadIcon from './assets/upload_icon.png';

const fileTypes = ['WAV', 'MP3', 'MP4', 'WEBM'];
const maxFileSizeMb = 200;

const AudioRecordUploader = ({ onUpload, onError }: { onUpload: (file: File) => void; onError: () => void }) => (
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
                handleChange={onUpload}
                name="file"
                types={fileTypes}
                maxSize={maxFileSizeMb}
                onSizeError={onError}
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
)

export default AudioRecordUploader;
