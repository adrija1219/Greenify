const express = require('express');
const router = express.Router();

// NOTE: We do NOT use require('@mistralai/mistralai') here 
// because it is an ES Module and will cause a crash on Vercel.

router.post('/consult', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. DYNAMIC IMPORT: This is the fix for the ERR_REQUIRE_ESM error.
        // It allows a CommonJS file (require) to load an ES Module (import).
        const { Mistral } = await import('@mistralai/mistralai');

        // 2. Initialize the Mistral client inside the request handler
        const client = new Mistral({ 
            apiKey: process.env.MISTRAL_API_KEY 
        });

        // 3. Call the Mistral API
        const chatResponse = await client.chat.complete({
            model: 'mistral-tiny',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are Dr. Green, a friendly and expert plant care assistant. Provide helpful advice on plant health, watering, and sunlight.' 
                },
                { 
                    role: 'user', 
                    content: message 
                }
            ],
        });

        // 4. Send the response back to your React frontend
        res.json({ 
            reply: chatResponse.choices[0].message.content 
        });

    } catch (error) {
        console.error("Dr. Green AI Error:", error);
        res.status(500).json({ 
            error: "Dr. Green is having trouble connecting to the AI. Please try again later." 
        });
    }
});

module.exports = router;