import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { processWebhookPayload } from "../utils/payloadProcessor.js";
import fs from 'fs';
import path from 'path';

export const importSamplePayloads = catchAsyncError(async (req, res, next) => {
    const dataDir = './data';
    
    // Checking if directory exists
    if (!fs.existsSync(dataDir)) {
        return res.status(400).json({
            success: false,
            message: `Directory ${dataDir} does not exist`
        });
    }
    
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No JSON files found in the directory'
        });
    }
    
    const results = [];
    
    for (const file of jsonFiles) {
        try {
            const filePath = path.join(dataDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const payload = JSON.parse(fileContent);
            
            const result = await processWebhookPayload(payload);
            results.push({ file, success: true, result });
        } catch (fileError) {
            results.push({ file, success: false, error: fileError.message });
        }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    res.status(200).json({
        success: true,
        message: "Sample data import completed",
        data: {
            totalFiles: jsonFiles.length,
            successCount,
            failCount,
            results
        }
    });
});
