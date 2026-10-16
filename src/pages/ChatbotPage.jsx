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
    <main className="mx-auto w-full max-w-[1200px] px-4 py-5 min-[551px]:px-6 min-[551px]:py-7">
      <h1 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">CineBot Assistant</h1>

      <div className="flex h-[calc(100vh-170px)] min-h-[420px] flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-gradient-to-b from-[#fafafa] to-white min-[551px]:h-[calc(100vh-210px)] min-[551px]:min-h-[460px]">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3.5 min-[551px]:p-[18px]" aria-live="polite">
          {messages
            .filter((message) => message.role !== 'system')
            .map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`markdown-content max-w-[92%] break-words rounded-[14px] px-3.5 py-2.5 text-[0.95rem] leading-[1.45] min-[551px]:max-w-[78%] ${message.role === 'user' ? 'self-end rounded-br bg-[#1674ea] text-white' : 'self-start rounded-bl bg-[#eef2f7] text-gray-800'}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}

          {isLoading && (
            <div
              className="inline-flex items-center gap-1.5 self-start rounded-bl-[4px] rounded-[14px] bg-[#eef2f7] px-3.5 py-2.5"
              aria-label="Assistant is typing"
            >
              <span className="h-[7px] w-[7px] animate-[typing-pulse_1.2s_ease-in-out_infinite] rounded-full bg-gray-500" />
              <span className="h-[7px] w-[7px] animate-[typing-pulse_1.2s_ease-in-out_0.15s_infinite] rounded-full bg-gray-500" />
              <span className="h-[7px] w-[7px] animate-[typing-pulse_1.2s_ease-in-out_0.3s_infinite] rounded-full bg-gray-500" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && <div className="px-3.5 pt-2.5 text-sm font-semibold text-red-700">{error}</div>}

        <form className="flex gap-2 border-t border-gray-200 bg-white p-2.5 min-[551px]:gap-3 min-[551px]:p-3.5" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about movies, actors, directors, or TV shows..."
            aria-label="Chat message"
            maxLength={MAX_INPUT_CHARACTERS}
            className="min-w-0 flex-1 rounded-[10px] border border-gray-200 px-3.5 py-3 text-[0.95rem] text-gray-900 outline-none focus:border-gray-400"
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()} className="rounded-[10px] bg-[#fee135] px-4 font-semibold text-black transition-colors hover:enabled:bg-[#fcd700] disabled:cursor-not-allowed disabled:opacity-60 min-[551px]:px-[18px]">
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChatbotPage;
