import axios from 'axios';

const GROQ_ENDPOINT = '/api/groq/chat/completions';

export const createChatCompletion = async (payload) => {
    try {
        const { data } = await axios.post(GROQ_ENDPOINT, payload);
        return data;
    } catch (error) {
        const status = error.response?.status;
        const reason = error.response?.data?.error?.message || error.message;
        const statusText = status ? ` (${status})` : '';

        throw new Error(`Groq request failed${statusText}: ${reason}`, { cause: error });
    }
};
