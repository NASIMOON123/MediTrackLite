
import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const faqsPath = path.resolve('faqs.json'); // adjust path as needed

router.post('/', async (req, res) => {
  let { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: 'Invalid input.' });
  }

  // Normalize: convert to lowercase and trim whitespace
  const userQuestion = message.toLowerCase().trim();

  try {
    const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));

    // Search for best match (simple match for now)
    const matched = faqs.find((faq) =>
      userQuestion.includes(faq.question)
    );

    if (matched) {
      return res.json({ reply: matched.answer });
    }

    return res.json({ reply: "I'm sorry, I couldn't find an answer. Please try asking something else related to MediTrackLite." });

  } catch (err) {
    console.error('Chatbot FAQ error:', err);
    return res.status(500).json({ reply: 'Something went wrong while processing your request.' });
  }
});

export default router;
