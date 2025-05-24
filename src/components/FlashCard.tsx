import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import React, { useRef, useState } from "react";
import type { QuizQuestion } from "../types";

interface FlashCardProps {
  questions: QuizQuestion[];
}

const FlashCard: React.FC<FlashCardProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    setIsGeneratingImage(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        backgroundColor: "white",
        width: 800,
        height: 450,
      });

      saveAs(dataUrl, `quiz-card-${currentIndex + 1}.png`);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No questions available. Please upload a document first.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-md ${
            currentIndex === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Card {currentIndex + 1} of {questions.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className={`px-4 py-2 rounded-md ${
            currentIndex === questions.length - 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* The flashcard */}
      <div
        ref={cardRef}
        className="relative w-full h-80 perspective-1000 mb-6"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full duration-500 preserve-3d relative ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <div
            className={`w-full h-full absolute backface-hidden bg-white border-2 rounded-xl shadow-lg p-8 flex flex-col ${
              isFlipped ? "hidden" : ""
            }`}
          >
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-xl font-medium text-gray-800 text-center">
                {currentQuestion.question}
              </h3>
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">
              Click to flip
            </div>
          </div>

          {/* Back of card */}
          <div
            className={`w-full h-full absolute backface-hidden bg-indigo-50 border-2 rounded-xl shadow-lg p-8 rotate-y-180 flex flex-col ${
              !isFlipped ? "hidden" : ""
            }`}
          >
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg text-gray-700 text-center">
                {currentQuestion.answer || "No answer provided"}
              </p>
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerateImage}
          disabled={isGeneratingImage}
          className={`px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center ${
            isGeneratingImage ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isGeneratingImage ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Generating...
            </>
          ) : (
            <>
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Download as Image
            </>
          )}
        </button>
      </div>

      {/* Adding the styles directly in the head to avoid the jsx attribute error */}
      <style>
        {`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        `}
      </style>
    </div>
  );
};

export default FlashCard;
