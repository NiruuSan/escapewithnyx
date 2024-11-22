// api.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Store your API key in .env
});

export async function fetchNyxResponse(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      messages: [
        { role: 'system', content: "You are Nyx, a young girl trapped inside a virtual space..." },
        { role: 'user', content: userMessage },
      ],
    });

    return response.choices[0].message.content; // Nyx's response
  } catch (error) {
    console.error('Error fetching response:', error);
    return "Sorry, I'm having trouble connecting right now.";
  }
}
