import { RefreshCw } from "lucide-react";
import { useState } from "react";
import type { QuizQuestion } from "./types";
import { generateQuizWithPerplexity } from "./utils/documentParser";

function App() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/script.txt");
      if (!response.ok) {
        throw new Error(`Failed to load script: ${response.statusText}`);
      }
      const scriptContent = await response.text();
      const questions = await generateQuizWithPerplexity(scriptContent);
      if (questions.length > 0) {
        setQuestion(questions[0]);
      } else {
        throw new Error("No questions generated");
      }
    } catch (err) {
      setError(
        `Error generating question: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setQuestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>Instagram Quiz</h1>
          <p style={{ textAlign: "center" }}>
            Generate beautiful quiz questions from Instagram scripts
          </p>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="card">
            {!question ? (
              <>
                <div className="card-header">
                  <h2 className="card-title">Generate a Quiz Question</h2>
                  <p className="card-description">
                    Click below to generate a multiple-choice quiz question from
                    the Instagram script.
                  </p>
                </div>
                <div className="card-content">
                  <button
                    onClick={handleGenerateQuestion}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading">
                        <RefreshCw size={20} />
                        Generating...
                      </span>
                    ) : (
                      "Generate Question"
                    )}
                  </button>
                </div>
                {error && (
                  <div className="card-footer">
                    <p className="error">{error}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="card-header">
                  <h2 className="card-title">{question.question}</h2>
                </div>
                <div className="card-content">
                  {question.answer ? (
                    question.answer.includes("\n") ? (
                      <div>
                        {question.answer.split("\n").map((line) => {
                          const optionRegex = /^[A-D][).]/;
                          const isOption = optionRegex.exec(line.trim());
                          if (!isOption) return null;
                          const optionLabel = line.trim().substring(0, 2);
                          const optionText = line.trim().substring(2);
                          return (
                            <div
                              key={`option-${optionLabel}`}
                              className="option"
                            >
                              <div className="option-label">{optionLabel}</div>
                              <div className="option-text">{optionText}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ textAlign: "center" }}>{question.answer}</p>
                    )
                  ) : (
                    <p style={{ textAlign: "center", fontStyle: "italic" }}>
                      No options provided
                    </p>
                  )}
                </div>
                <div className="card-footer">
                  <button
                    onClick={handleGenerateQuestion}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading">
                        <RefreshCw size={20} />
                        Generating...
                      </span>
                    ) : (
                      "Generate New Question"
                    )}
                  </button>
                  <button
                    className="ghost-button"
                    onClick={() => setQuestion(null)}
                    disabled={isLoading}
                  >
                    Back to Start
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Instagram Quiz Generator</p>
      </footer>
    </>
  );
}

export default App;
