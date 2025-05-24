import React, { useState } from "react";
import type { QuizQuestion } from "../types";
import { generateQuizWithPerplexity } from "../utils/documentParser";

interface QuestionGeneratorProps {
  onQuestionGenerated: (question: QuizQuestion) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  onQuestionGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the content from the text file in public directory
      const response = await fetch("/script.txt");
      if (!response.ok) {
        throw new Error(`Failed to load script: ${response.statusText}`);
      }

      const mdContent = await response.text();

      // Generate a question from the content
      const questions = await generateQuizWithPerplexity(mdContent);

      if (questions.length > 0) {
        onQuestionGenerated(questions[0]);
      } else {
        throw new Error("No questions generated");
      }
    } catch (err) {
      setError(
        `Error generating question: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Instagram Quiz Generator
      </h2>

      <p className="mb-4 text-gray-600">
        Click the button below to generate a quiz question from the Instagram
        script.
      </p>

      <button
        onClick={handleGenerateQuestion}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Question"
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
