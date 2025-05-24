import { useState } from "react";
import FileUploader from "./components/FileUploader";
import FlashCard from "./components/FlashCard";
import type { QuizQuestion } from "./types";

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "cards">("upload");

  const handleQuestionsGenerated = (newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    setActiveTab("cards");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Quiz Card Generator</h1>
          <p className="mt-2 text-indigo-100">
            Upload a document and generate quiz flashcards with AI-powered
            questions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === "upload"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab("cards")}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === "cards"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={questions.length === 0}
          >
            Flash Card
          </button>
        </div>

        {questions.length === 0 && activeTab === "cards" && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No flash cards yet
            </h3>
            <p className="mt-2 text-gray-500">
              Upload a document first to generate quiz questions
            </p>
          </div>
        )}

        {activeTab === "upload" ? (
          <FileUploader onQuestionsGenerated={handleQuestionsGenerated} />
        ) : questions.length > 0 ? (
          <FlashCard questions={questions} />
        ) : null}
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Quiz Card Generator App</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
