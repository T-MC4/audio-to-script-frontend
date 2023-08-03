export enum ValidationError {
    fileSize = 'fileSize',
    contextLimit = 'contextLimit',
    transcriptMissing = 'transcript-missing'
}

export const errorLabels = {
    [ValidationError.fileSize]: 'File size ololo todo',
    [ValidationError.contextLimit]: 'context-limit-exceeded',
    [ValidationError.transcriptMissing]: 'transcript-missing',
} as const