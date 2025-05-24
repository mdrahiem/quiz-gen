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
            Upload a document and generate quiz flashcards
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
            Flash Cards ({questions.length})
          </button>
        </div>

        {activeTab === "upload" ? (
          <FileUploader onQuestionsGenerated={handleQuestionsGenerated} />
        ) : (
          <FlashCard questions={questions} />
        )}
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
