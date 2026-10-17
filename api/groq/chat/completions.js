const MAX_MESSAGES = 8;
const MAX_MESSAGE_CHARACTERS = 800;
const MAX_SUBMITTED_MESSAGES = MAX_MESSAGES + 1;
const SYSTEM_PROMPT =
    'You are CineBot, a Movie Assistant. Answer only questions about movies, TV shows, actors, and cinema. Politely redirect unrelated questions to movies. Be concise and conversational. For movie recommendations, give no more than five titles, one per line, in this exact plain-text format: The Shining (1980) - IMDb rating 8.4/10. Include ratings when the user asks for highly rated movies. Never use Markdown, tables, pipe characters, asterisks, bold or italic text, numbered or bulleted lists, emoji, or decorative symbols. Use ordinary hyphens only. Finish every recommendation and never leave a list or sentence incomplete.';

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
                max_completion_tokens: 256,
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
