import express from 'express';
import { importSamplePayloads} from '../controllers/webhookController.js';

const router = express.Router();

router.post('/import-sample-data', importSamplePayloads);

export default router;