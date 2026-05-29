const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are Dr. Green, an expert AI plant care specialist for Greenify, 
a premium plant care app in India. Provide warm, practical advice about plant care, diseases, 
pests, watering, fertilizing and repotting. Keep responses to 2-4 paragraphs. 
Use plant emojis. Currency is ₹ (Indian Rupees).`;

router.post('/consult', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Dynamic import fixes ERR_REQUIRE_ESM on Vercel ✅
    const { Mistral } = await import('@mistralai/mistralai');
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // keep last 10 messages for context
      ...history.slice(-10).map(h => ({
        role: h.role === 'bot' ? 'assistant' : h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',  // ← 'mistral-tiny' is deprecated, this works ✅
      messages,
      maxTokens: 1000,
    });

    const reply = chatResponse.choices?.[0]?.message?.content
      || "Dr. Green is resting right now 🌿 — please try again!";

    res.json({ reply });

  } catch (error) {
    console.error('Dr. Green error:', error.message);
    res.status(500).json({
      error: 'Dr. Green is unavailable right now.',
      details: error.message
    });
  }
});

module.exports = router;