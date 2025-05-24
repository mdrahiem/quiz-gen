import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { v4 as uuidv4 } from "uuid";
import PERPLEXITY_CONFIG from "../config/perplexity";
import type { QuizQuestion } from "../types";

// Set the PDF.js worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Function to parse text from Word document
export const parseWordDocument = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else {
          reject(new Error("Failed to read file"));
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(String(error)));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Function to parse text from PDF document
export const parsePdfDocument = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;

          let fullText = "";

          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: { str: string }) => item.str)
              .join(" ");

            fullText += pageText + "\n\n";
          }

          resolve(fullText);
        } else {
          reject(new Error("Failed to read file"));
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(String(error)));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Function to extract options from the question content
const extractOptionsFromContent = (
  content: string
): { question: string; options: string } => {
  const mainQuestion = content.trim();

  // Look for multiple-choice options like "A) Option" or "A. Option"
  const letterOptionsPattern = /\n\s*[A-D][).]\s.+(\n\s*[A-D][).]\s.+)*/;
  const letterMatch = letterOptionsPattern.exec(mainQuestion);

  if (letterMatch) {
    const optionsStartIndex = mainQuestion.indexOf(letterMatch[0]);
    if (optionsStartIndex > 0) {
      return {
        question: mainQuestion.substring(0, optionsStartIndex).trim(),
        options: letterMatch[0].trim(),
      };
    }
  }

  // Try numbered options like "1) Option" or "1. Option"
  const numberedOptionsPattern = /\n\s*[1-4][).]\s.+(\n\s*[1-4][).]\s.+)*/;
  const numberedMatch = numberedOptionsPattern.exec(mainQuestion);

  if (numberedMatch) {
    const optionsStartIndex = mainQuestion.indexOf(numberedMatch[0]);
    if (optionsStartIndex > 0) {
      return {
        question: mainQuestion.substring(0, optionsStartIndex).trim(),
        options: numberedMatch[0].trim(),
      };
    }
  }

  // If no options were found, look for question mark as separator
  const questionMarkIndex = mainQuestion.indexOf("?");
  if (questionMarkIndex > 0) {
    return {
      question: mainQuestion.substring(0, questionMarkIndex + 1).trim(),
      options: mainQuestion.substring(questionMarkIndex + 1).trim(),
    };
  }

  // Default: keep entire content as question, no options
  return {
    question: mainQuestion,
    options: "",
  };
};

// Function to generate quiz questions using Perplexity Sonar API
export const generateQuizWithPerplexity = async (
  text: string
): Promise<QuizQuestion[]> => {
  try {
    if (!PERPLEXITY_CONFIG.API_KEY) {
      console.warn(
        "Perplexity API key not set. Using fallback question generation."
      );
      return generateQuizQuestions(text);
    }

    const response = await fetch(
      `${PERPLEXITY_CONFIG.BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEXITY_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          model: PERPLEXITY_CONFIG.MODEL,
          messages: [
            {
              role: "system",
              content: PERPLEXITY_CONFIG.PROMPT,
            },
            {
              role: "user",
              content: `Generate a quiz based on this content: ${text.substring(
                0,
                4000
              )}`, // Limit text to 4000 chars to stay within token limits
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;

    console.log("AI response:", aiContent); // For debugging

    // Process the API response to extract the question and options
    const questionData = extractOptionsFromContent(aiContent);

    // Clean up the question text
    let questionText = questionData.question.replace(/^Q\.?\s*/, ""); // Remove "Q." prefix
    questionText = questionText.replace(/^Question:?\s*/i, ""); // Remove "Question:" prefix
    questionText = questionText.replace(/^\d+\.\s*/i, ""); // Remove "1. " numbering prefix

    // Create a single question object
    const questions: QuizQuestion[] = [
      {
        id: uuidv4(),
        question: questionText,
        answer: questionData.options || "No answer provided",
      },
    ];

    // If we didn't parse any valid questions, create a fallback question
    // if (questions.length === 0) {
    //   questions.push({
    //     id: uuidv4(),
    //     question: aiContent,
    //     answer: "No specific options provided",
    //   });
    // }

    return questions;
  } catch (error) {
    console.error("Error generating quiz with Perplexity:", error);
    console.warn("Using fallback question generation due to API error.");
    return generateQuizQuestions(text);
  }
};

// Function to generate quiz questions from text
export const generateQuizQuestions = (
  text: string,
  count: number = 10
): QuizQuestion[] => {
  // Split text into sentences or paragraphs
  const sentences = text
    .split(/[.!?]\s+/)
    .filter(
      (sentence) => sentence.trim().length > 20 && sentence.trim().length < 200
    )
    .map((sentence) => sentence.trim());

  // For simplicity, we'll just create questions from the sentences
  // In a real app, you'd use NLP or AI to generate better questions
  const questions: QuizQuestion[] = [];

  // Select random sentences to create questions
  const maxQuestions = Math.min(count, sentences.length);
  const selectedIndexes = new Set<number>();

  while (selectedIndexes.size < maxQuestions) {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    selectedIndexes.add(randomIndex);
  }

  // Create questions from selected sentences
  Array.from(selectedIndexes).forEach((index) => {
    const sentence = sentences[index];
    // Create a simple question by asking about the sentence
    questions.push({
      id: uuidv4(),
      question: `What does this mean: "${sentence}"?`,
      // In a real app, you'd generate proper answers
      answer: "The answer would be generated using AI or provided by the user.",
    });
  });

  return questions;
};
