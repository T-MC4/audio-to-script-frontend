export enum ValidationError {
    uploadFile = 'upload-file',
    fileSize = 'file-size',
    contextLimit = 'context-limit-exceeded',
    transcriptMissing = 'transcript-missing',
    default = 'default'
}

const isValidationError = (value: unknown): value is ValidationError => {
    const errors = Object.values(ValidationError);
    return typeof value === "string" && errors.includes(value as ValidationError);
}

export const getValidationError = (value: unknown): ValidationError => {
    if (isValidationError(value)) return value;
    if (value && typeof value === 'object' && 'message' in value && isValidationError(value.message)) return value.message;
    return ValidationError.default;
}

export const errorLabels = {
    [ValidationError.fileSize]: 'The file size should not exceed 200 MB.',
    [ValidationError.contextLimit]: 'Input exceeds allowed limit. Please provide a shorter input.',
    [ValidationError.transcriptMissing]: 'Transcript missing.',
    [ValidationError.uploadFile]: 'Unable to upload file. Please check internet connection, then try again.',
    [ValidationError.default]: 'Something went wrong. Please try again.',
} as const

export enum TranscriptSource {
    audioToScript = 'audio-to-script',
    copyPasteToScript = 'copy-paste-to-script'
}

export enum Flow {
    salesAdvanced = 'sales-advanced',
    customerServiceAdvanced = 'customer-service-advanced',
    standardScriptOnly = 'standard-script-only',
}

export const flowQueryParam = 'flow'

export const transcriptSourceQueryParam = 'transcript_source'