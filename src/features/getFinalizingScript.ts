import { Flow } from "../constants";
import promptTemplates, { scriptPlaceholder } from './promptTemplates';

const removeScriptStart = (script: string) => script.replace(/[\s\S]*START SCRIPT:\s*/g, '');

const removeRepLabel = (script: string) => script.replace(/Rep:\s/g, '')

const removeWFPTR = (script: string) => script.replaceAll('*WFPTR*', '');

const formatParagraphsAndAddWaitForProspect = (script: string) =>
    script
        .split(/\n+/g)
        .map(part => part.trim())
        .filter(part => !!part)
        .map(part => `~ "${part}"`)
        .join('\n\n*Wait For Prospect To Respond*\n\n');

const optimizeNewLines = (script: string) => script.replaceAll(/\n+/g, '\n\n');

const wrapWithPromptTemplate = (script: string, flow: Flow.customerServiceAdvanced | Flow.salesAdvanced) => {
    const template = promptTemplates[flow];
    return template.replace(scriptPlaceholder, script);
}

const removeSurroundingQuotes = (script: string) => {
    if (script.charAt(0) === '"' && script.charAt(script.length - 1) === '"')
        return script.substring(1, script.length - 1);;
    return script;
}

const getFinalizingScript = (
    script: string,
    flow: Flow
) => {
    let finalScript = script;
    finalScript = removeSurroundingQuotes(finalScript);
    finalScript = removeScriptStart(finalScript);
    finalScript = removeRepLabel(finalScript);

    if (flow === Flow.customerServiceAdvanced || flow === Flow.salesAdvanced) {
        finalScript = removeWFPTR(finalScript);
        finalScript = formatParagraphsAndAddWaitForProspect(finalScript);
        finalScript = wrapWithPromptTemplate(finalScript, flow);
    }

    if (flow === Flow.standardScriptOnly) {
        finalScript = removeWFPTR(finalScript);
        finalScript = optimizeNewLines(finalScript);
    }


    return finalScript;
}

export default getFinalizingScript;
