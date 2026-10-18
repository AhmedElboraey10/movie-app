const MAX_MESSAGES = 8;
const MAX_USER_MESSAGE_CHARACTERS = 800;
const MAX_ASSISTANT_MESSAGE_CHARACTERS = 8000;
const MAX_SUBMITTED_MESSAGES = MAX_MESSAGES;
const MAX_COMPLETION_TOKENS = 1024;
const SYSTEM_PROMPT =
    'You are CineBot, a Movie Assistant. Answer only questions about movies, TV shows, actors, and cinema. Politely redirect unrelated questions to movies. Match your answer length to the request. For simple facts such as a movie rating, runtime, or genre, answer directly in one short sentence and stop; do not add unrelated background or a follow-up question. When asked for details, give enough relevant information to explain a movie, name its filmmakers or cast, recommend movies, or compare titles without filler. For recommendation lists, provide the number of titles the user requests, up to ten; if they do not specify a number, give up to five. Put each title on its own plain-text line. Include years and ratings when the user asks for highly rated or top-rated movies. Respect corrections and clarifications in follow-up messages, and do not repeat a previous answer unchanged when the user asks you to revise it. Never use Markdown, tables, pipe characters, asterisks, numbered or bulleted lists, emoji, or decorative symbols. Use ordinary punctuation. Answer the most recent question directly.';

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
            !['user', 'assistant'].includes(role) ||
            typeof content !== 'string' ||
            content.trim().length === 0 ||
            content.length >
                (role === 'assistant'
                    ? MAX_ASSISTANT_MESSAGE_CHARACTERS
                    : MAX_USER_MESSAGE_CHARACTERS)
        ) {
            return null;
        }
        return { role, content: content.trim() };
    });

    const conversation = validMessages;
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
                max_completion_tokens: MAX_COMPLETION_TOKENS,
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
