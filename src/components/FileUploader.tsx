import { useState } from "react";
import type { QuizQuestion } from "../types";
import {
  generateQuizQuestions,
  parseWordDocument,
} from "../utils/documentParser";

interface FileUploaderProps {
  onQuestionsGenerated: (questions: QuizQuestion[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onQuestionsGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [useAI, setUseAI] = useState(true);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      let text = "";
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "docx") {
        text = await parseWordDocument(file);
      } else if (fileExtension === "pdf") {
        try {
          const { parsePdfDocument } = await import("../utils/documentParser");
          text = await parsePdfDocument(file);
        } catch (pdfError) {
          setError(
            `Error parsing PDF file: ${
              pdfError instanceof Error ? pdfError.message : String(pdfError)
            }`
          );
          setIsLoading(false);
          return;
        }
      } else {
        setError(
          "Unsupported file format. Please upload a Word (.docx) or PDF file."
        );
        setIsLoading(false);
        return;
      }

      let questions: QuizQuestion[];

      if (useAI) {
        try {
          const { generateQuizWithPerplexity } = await import(
            "../utils/documentParser"
          );
          questions = await generateQuizWithPerplexity(text);
        } catch (aiError) {
          console.warn(
            "Error using AI to generate questions, falling back to basic generator:",
            aiError
          );
          questions = generateQuizQuestions(text, numQuestions);
        }
      } else {
        questions = generateQuizQuestions(text, numQuestions);
      }

      onQuestionsGenerated(questions);
    } catch (err) {
      setError(
        `Error processing file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Document</h2>

      <div className="mb-4">
        <label
          htmlFor="num-questions"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of Questions
        </label>
        <input
          id="num-questions"
          type="number"
          min="1"
          max="50"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          id="use-ai"
          type="checkbox"
          checked={useAI}
          onChange={(e) => setUseAI(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="use-ai"
          className="ml-2 block text-sm font-medium text-gray-700"
        >
          Use AI to generate a better multiple-choice question
        </label>
      </div>

      {useAI && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            AI-powered question requires a Perplexity API key in your .env file
          </p>
        </div>
      )}

      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Upload Word or PDF Document
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".docx,.pdf"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">Word (.docx) or PDF files</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-600">Processing document...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
