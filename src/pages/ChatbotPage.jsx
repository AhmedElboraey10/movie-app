import { useEffect, useRef, useState } from 'react';
import { createChatCompletion } from '../services/groqService';

const MAX_HISTORY_MESSAGES = 8;
const MAX_INPUT_CHARACTERS = 800;

export const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
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
            const data = await createChatCompletion({
                messages: updatedMessages.slice(-MAX_HISTORY_MESSAGES),
            });

            const resolvedReply = data.choices?.[0]?.message?.content?.trim();
            if (!resolvedReply) {
                throw new Error('Groq returned an empty response.');
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: resolvedReply }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto w-full max-w-300 px-4 py-5 sm:px-6 sm:py-7">
            <h1 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">
                CineBot Assistant
            </h1>

            <div className="flex h-[calc(100vh-10.625rem)] min-h-105 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-b from-[#fafafa] to-white sm:h-[calc(100vh-13.125rem)] sm:min-h-115">
                <div
                    className="flex flex-1 flex-col gap-3 overflow-y-auto p-3.5 sm:p-4.5"
                >
                    {messages.map((message, idx) => (
                        <div
                            key={`${message.role}-${idx}`}
                            className={`max-w-11/12 wrap-break-word rounded-2xl px-3.5 py-2.5 text-base leading-6 sm:max-w-3/4 ${message.role === 'user' ? 'self-end rounded-br bg-[#1674ea] text-white' : 'self-start rounded-bl bg-[#eef2f7] text-gray-800'}`}
                        >
                            {message.content}
                        </div>
                    ))}

                    {isLoading && (
                        <div
                            className="inline-flex items-center gap-1.5 self-start rounded-bl-sm rounded-2xl bg-[#eef2f7] px-3.5 py-2.5"
                        >
                            <span className="size-2 animate-[typing-pulse_1.2s_ease-in-out_infinite] rounded-full bg-gray-500" />
                            <span className="size-2 animate-[typing-pulse_1.2s_ease-in-out_0.15s_infinite] rounded-full bg-gray-500" />
                            <span className="size-2 animate-[typing-pulse_1.2s_ease-in-out_0.3s_infinite] rounded-full bg-gray-500" />
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {error && (
                    <div className="px-3.5 pt-2.5 text-sm font-semibold text-red-700">{error}</div>
                )}

                <form
                    className="flex gap-2 border-t border-gray-200 bg-white p-2.5 sm:gap-3 sm:p-3.5"
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about movies, actors, directors, or TV shows..."
                        maxLength={MAX_INPUT_CHARACTERS}
                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3.5 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
                    />
                    <button
                        disabled={isLoading || !inputValue.trim()}
                        className="rounded-xl bg-[#fee135] px-4 font-semibold text-black transition-colors hover:enabled:bg-[#fcd700] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    >
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ChatbotPage;
