import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GROQ_ENDPOINT = '/groq-api/chat/completions';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-20b';
const MAX_HISTORY_MESSAGES = 8;
const MAX_COMPLETION_TOKENS = 128;
const MAX_INPUT_CHARACTERS = 800;
const SYSTEM_PROMPT =
  'You are CineBot, a Movie Assistant. You must ONLY answer questions related to movies, TV shows, actors, and cinema. If a user asks about anything else, politely decline and steer the conversation back to movies. Keep answers concise, within 60 words unless the user asks for more detail.';

const initialMessages = [];

export const ChatbotPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage = { role: 'user', content: trimmedInput };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.slice(-MAX_HISTORY_MESSAGES),
          ],
          max_completion_tokens: MAX_COMPLETION_TOKENS,
          reasoning_effort: 'low',
          temperature: 0.4,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || `Groq request failed (${response.status})`,
        );
      }

      const resolvedReply = data.choices?.[0]?.message?.content?.trim();
      if (!resolvedReply) {
        throw new Error('Groq returned an empty response.');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: resolvedReply },
      ]);
    } catch (err) {
      const fallbackError =
        'Failed to connect to the movie assistant. Please try again.';
      setError(
        err instanceof Error && err.message ? err.message : fallbackError,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container chatbot-page">
      <h1 className="section-title">CineBot Assistant</h1>

      <div className="chatbot-shell">
        <div className="chatbot-messages" aria-live="polite">
          {messages
            .filter((message) => message.role !== 'system')
            .map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`chatbot-message ${message.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant'}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}

          {isLoading && (
            <div
              className="chatbot-message chatbot-message-assistant chatbot-loading-bubble"
              aria-label="Assistant is typing"
            >
              <span className="chatbot-dot" />
              <span className="chatbot-dot" />
              <span className="chatbot-dot" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && <div className="chatbot-error">{error}</div>}

        <form className="chatbot-input-row" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about movies, actors, directors, or TV shows..."
            aria-label="Chat message"
            maxLength={MAX_INPUT_CHARACTERS}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
