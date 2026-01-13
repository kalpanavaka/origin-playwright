 import * as fs from 'fs';
// We use 'require' here to bypass the TypeScript default import issue
const pdfParse = require('pdf-parse');

/**
 * Reads a PDF file and extracts text.
 * Fixed the "pdfParse is not a function" error.
 */
export async function extractPdfText(pdfPath: string): Promise<string> {
    if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at path: ${pdfPath}`);
    }

    const buffer = fs.readFileSync(pdfPath);
    
    try {
        // Calling the required module directly
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
}