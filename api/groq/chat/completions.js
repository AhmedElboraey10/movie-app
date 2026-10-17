const MAX_MESSAGES = 8;
const MAX_MESSAGE_CHARACTERS = 800;
const MAX_SUBMITTED_MESSAGES = MAX_MESSAGES + 1;
const SYSTEM_PROMPT =
    'You are CineBot, a Movie Assistant. You must ONLY answer questions related to movies, TV shows, actors, and cinema. If a user asks about anything else, politely decline and steer the conversation back to movies. Keep answers concise, within 60 words unless the user asks for more detail.';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Chat service is not configured.' });
    }

    const messages = req.body?.messages;
    if (
        !Array.isArray(messages) ||
        messages.length === 0 ||
        messages.length > MAX_SUBMITTED_MESSAGES
    ) {
        return res.status(400).json({ error: 'Invalid chat history.' });
    }

    const validMessages = messages.map((message) => {
        if (!message || typeof message !== 'object') {
            return null;
        }
        const { role, content } = message;
        if (
            !['system', 'user', 'assistant'].includes(role) ||
            typeof content !== 'string' ||
            content.trim().length === 0 ||
            content.length > (role === 'system' ? 1000 : MAX_MESSAGE_CHARACTERS)
        ) {
            return null;
        }
        return { role, content: content.trim() };
    });

    const conversation = validMessages.filter((message) => message?.role !== 'system');
    if (
        validMessages.includes(null) ||
        conversation.length === 0 ||
        conversation.length > MAX_MESSAGES ||
        conversation.at(-1)?.role !== 'user'
    ) {
        return res.status(400).json({ error: 'Invalid chat messages.' });
    }

    let upstream;
    try {
        upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...conversation],
                max_completion_tokens: 128,
                reasoning_effort: 'low',
                temperature: 0.4,
            }),
        });
    } catch (error) {
        return res.status(502).json({ error: `Chat request failed: ${error.message}` });
    }

    try {
        const data = await upstream.json();
        return res.status(upstream.status).json(data);
    } catch {
        return res.status(502).json({ error: 'Chat service returned an invalid response.' });
    }
}
