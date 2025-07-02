import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const faqsPath = path.resolve('faqs.json');

// POST route: chatbot response based on question match
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: 'Invalid input.' });
  }

  const userInput = message.toLowerCase().trim();

  try {
    const categories = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));

    let matched = null;

    for (const category of categories) {
      for (const qa of category.qa) {
        if (userInput.includes(qa.question.toLowerCase().trim())) {
          matched = qa;
          break;
        }
      }
      if (matched) break;
    }

    if (matched) {
      return res.json({ reply: matched.answer });
    }

    return res.json({
      reply:
        "I'm sorry, I couldn't find an answer. Please try asking something else related to MediTrackLite.",
    });
  } catch (err) {
    console.error('Chatbot FAQ error:', err);
    return res.status(500).json({ reply: 'Server error while fetching FAQs.' });
  }
});

// GET route: fetch all categorized FAQs
router.get('/faqs', (req, res) => {
  try {
    const categories = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
    res.json(categories);
  } catch (err) {
    console.error('Error loading FAQs:', err);
    res.status(500).json({ error: 'Failed to load FAQs' });
  }
});

export default router;