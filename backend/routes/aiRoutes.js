const express = require('express');
const router = express.Router();
const { chatWithAI, checkAIStatus } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithAI);
router.get('/status', protect, checkAIStatus);

module.exports = router;
