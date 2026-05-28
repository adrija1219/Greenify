const express = require('express');
const router = express.Router();
const { Mistral } = require('@mistralai/mistralai');

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const SYSTEM_PROMPT = `You are Dr. Green, an expert AI plant care specialist for Greenify, a premium plant care app in India. 
You provide warm, knowledgeable, practical advice about plant care, diseases, pests, watering schedules, fertilizing, repotting, and plant identification. 
Keep responses concise (2-4 paragraphs max). Use plant emojis occasionally. Always give actionable advice. 
Currency is ₹ (Indian Rupees). Never break character.`;

// POST /api/ai/consult
router.post('/consult', async (req, res) => {
  console.log('📩 Dr. Green request:', req.body.message?.substring(0, 80));

  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // last 10 messages for context, avoids token limits
      ...history.slice(-10).map(h => ({
        role: h.role === 'bot' ? 'assistant' : h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const reply =
      chatResponse.choices?.[0]?.message?.content ||
      "Dr. Green is resting right now 🌿 — please try again!";

    console.log('✅ Mistral responded successfully');
    res.json({ reply });

  } catch (error) {
    console.error('❌ Mistral error:', error.message);
    res.status(500).json({ error: 'AI Assistant error', details: error.message });
  }
});

module.exports = router;