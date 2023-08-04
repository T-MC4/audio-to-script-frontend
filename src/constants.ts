export enum ValidationError {
    fileSize = 'fileSize',
    contextLimit = 'contextLimit',
    transcriptMissing = 'transcript-missing'
}

export const errorLabels = {
    [ValidationError.fileSize]: 'The file size should not exceed 200 MB.',
    [ValidationError.contextLimit]: 'Input exceeds allowed limit. Please provide a shorter input.',
    [ValidationError.transcriptMissing]: 'Transcript missing.',
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