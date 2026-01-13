 import * as fs from 'fs';
// Use require but handle the potential nesting
const pdf = require('pdf-parse');

export async function extractPdfText(pdfPath: string): Promise<string> {
    if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at path: ${pdfPath}`);
    }

    const buffer = fs.readFileSync(pdfPath);
    
    try {
        // Some versions of pdf-parse require calling .default or the variable itself
        const parseFunction = typeof pdf === 'function' ? pdf : pdf.default;
        
        if (typeof parseFunction !== 'function') {
            // Fallback: If it's still not a function, try calling it directly as a last resort
            const data = await pdf(buffer);
            return data.text;
        }

        const data = await parseFunction(buffer);
        return data.text;
    } catch (error: any) {
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
}