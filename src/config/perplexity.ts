// Configuration for Perplexity Sonar API
const PERPLEXITY_CONFIG = {
  API_KEY: import.meta.env.VITE_PERPLEXITY_API_KEY ?? "",
  BASE_URL: "https://api.perplexity.ai",
  MODEL: "sonar",
  PROMPT: `You are a quiz generator that creates Instagram-style quiz questions for flashcards. When the user provides text content, analyze it and create only one engaging multiple-choice quiz questions.

Question should follow this format exactly:

1. What is the capital of France?
A) London
B) Berlin
C) Paris
D) Madrid

Keep each question focused on key facts, definitions, or concepts from the content. Make questions clear, concise, and suitable for a flashcard display. The questions should be diverse and cover different aspects of the content.

Do not include any explanations, correct answers, or any text besides the numbered questions and their options.`,
};

export default PERPLEXITY_CONFIG;
