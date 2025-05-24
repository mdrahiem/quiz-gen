import React from "react";
import type { QuizQuestion } from "../types";

interface FlashCardProps {
  questions: QuizQuestion[];
}

const FlashCard: React.FC<FlashCardProps> = ({ questions }) => {
  // Always use the first question from the array
  const currentQuestion = questions[0];

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No questions available. Please upload a document first.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Just show the single card without navigation controls */}
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-700">
          Quiz Flash Card
        </h2>
      </div>

      <div className="w-full max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-lg bg-white mt-8">
        {/* Card Header - Always show the question */}
        <div className="bg-indigo-600 text-white p-4">
          <h2 className="text-xl font-semibold text-center">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Card Body - Show the options */}
        <div className="p-6">
          {currentQuestion.answer ? (
            currentQuestion.answer.includes("\n") ? (
              <div className="space-y-3">
                {currentQuestion.answer.split("\n").map((line, index) => {
                  // Use RegExp.exec instead of match
                  const optionRegex = /^[A-D][).]/;
                  const isOption = optionRegex.exec(line.trim());
                  // Generate a more robust key
                  const optionKey = isOption
                    ? `option-${line.trim().substring(0, 2)}`
                    : `line-${index}-${line
                        .trim()
                        .substring(0, 10)
                        .replace(/\s/g, "-")}`;

                  return (
                    <div
                      key={optionKey}
                      className={
                        isOption
                          ? "p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors duration-200"
                          : ""
                      }
                    >
                      {isOption && (
                        <span className="inline-block w-8 mr-2 text-indigo-600 font-bold">
                          {line.trim().substring(0, 2)}
                        </span>
                      )}
                      <span className="text-gray-800">
                        {isOption ? line.trim().substring(2) : line}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-700">{currentQuestion.answer}</p>
            )
          ) : (
            <p className="text-gray-700 italic">No options provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
