import axios from 'axios';

const GROQ_ENDPOINT = '/api/groq/chat/completions';

export const createChatCompletion = async (payload) => {
    try {
        const { data } = await axios.post(GROQ_ENDPOINT, payload);
        return data;
    } catch (error) {
        const status = error.response?.status;
        let message;

        if (status === 400) {
            message = "I couldn't continue this chat. Please start a new conversation.";
        } else if (status === 429) {
            message = 'The assistant is busy right now. Please try again in a moment.';
        } else if (!status) {
            message = "I couldn't reach the assistant. Check your connection and try again.";
        } else {
            message = "The assistant couldn't reply right now. Please try again shortly.";
        }

        throw new Error(message, { cause: error });
    }
};
