import { useEffect, useState } from "react";
import data from "./data";
import { cn } from "../lib/utils";
import { openDB } from "idb";

const DB_NAME = "QuizHistoryDB";
const STORE_NAME = "quizHistory";

// Open IndexedDB
const openQuizDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

const saveQuizHistory = async (quizResult: object) => {
  const db = await openQuizDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.add(quizResult);
  await tx.done;
};

const getQuizHistory = async () => {
  const db = await openQuizDB();
  return db.getAll(STORE_NAME);
};

const QuizComponent = () => {
  const [quesNumber, setQuesNumber] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [selectedOption, setSelectedOption] = useState<
    Record<number, number | null>
  >({});
  const [inputValue, setInputValue] = useState<Record<number, string>>({});
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

  const quiz = data[quesNumber];

  useEffect(() => {
    setTimeLeft(30);
  }, [quesNumber]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNext = () => {
    if (quiz.type === "integer") {
      handleIntegerAnswer();
    }
    if (quesNumber < data.length - 1) {
      setQuesNumber(quesNumber + 1);
      setInputValue((prev) => ({ ...prev, [quesNumber]: "" }));
    }
  };

  const handleAnswer = (index: number) => {
    if (!answered[quesNumber] && quiz.options) {
      setSelectedOption((prev) => ({ ...prev, [quesNumber]: index }));
      setAnswered((prev) => ({ ...prev, [quesNumber]: true }));

      const selectedAnswer = quiz.options[index][0];
      if (selectedAnswer === quiz.answer) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleIntegerAnswer = () => {
    if (!answered[quesNumber]) {
      const userAnswer = parseInt(inputValue[quesNumber] || "", 10);
      if (!isNaN(userAnswer) && userAnswer === Number(quiz.answer)) {
        setAnswered((prev) => ({ ...prev, [quesNumber]: true }));
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleSubmit = async () => {
    setQuizCompleted(true);
    const quizResult = {
      score,
      totalQuestions: data.length,
      date: new Date().toLocaleString(),
    };

    await saveQuizHistory(quizResult);
    setQuizHistory([...quizHistory, quizResult]);
  };

  const restartQuiz = () => {
    setQuesNumber(0);
    setScore(0);
    setAnswered({});
    setSelectedOption({});
    setInputValue({});
    setQuizCompleted(false);
  };

  return (
    <div className="bg-teal-400 rounded-lg shadow-lg p-6 w-3/4 max-md:w-full hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
      {quizCompleted ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Quiz Completed! 🎉</h2>
          <p className="text-2xl font-semibold text-white mt-4">
            Your Score: {score} / {data.length}
          </p>
          <button
            onClick={restartQuiz}
            className="mt-6 bg-red-600 text-white p-3 rounded-lg shadow-lg hover:shadow-2xl transition-all"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full bg-white rounded-full p-1 h-[20px]">
            <div
              className="bg-teal-100 rounded-full h-[10px] transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>

          <div className="text-right mt-2 text-lg font-semibold text-white">
            Time Remaining: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>

          <h2 className="text-3xl font-bold my-6">
            Question {quesNumber + 1} of {data.length}
          </h2>
          <div className="text-xl font-semibold mb-4">{quiz.question}</div>

          {quiz.type === "mcq" && (
            <div className="grid grid-cols-2 w-full gap-6">
              {quiz.options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={cn(
                    "bg-white text-black font-semibold p-4 rounded-xl shadow-lg transition-all duration-250 hover:scale-105 hover:shadow-2xl",
                    answered[quesNumber]
                      ? selectedOption[quesNumber] === index
                        ? selectedOption[quesNumber] ===
                          quiz.options.findIndex(
                            (opt) => opt[0] === quiz.answer
                          )
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : ""
                      : "cursor-pointer"
                  )}
                >
                  {option}
                </div>
              ))}
            </div>
          )}

          {quiz.type === "integer" && (
            <div className="bg-white p-3 w-1/2 rounded-xl">
              <input
                type="text"
                placeholder="Write Your Answer Here"
                value={inputValue[quesNumber] || ""}
                onChange={(e) => {
                  if (!answered[quesNumber]) {
                    setInputValue({
                      ...inputValue,
                      [quesNumber]: e.target.value,
                    });
                  }
                }}
                disabled={answered[quesNumber]}
                className="outline-none w-full border p-2 rounded-md"
              />

              {inputValue[quesNumber] !== undefined &&
                inputValue[quesNumber].trim() !== "" &&
                !answered[quesNumber] && (
                  <button
                    onClick={() => {
                      setAnswered({ ...answered, [quesNumber]: true });
                    }}
                    className="mt-2 bg-blue-600 text-white p-2 rounded-md"
                  >
                    Submit Answer
                  </button>
                )}

              {answered[quesNumber] && (
                <div
                  className={`mt-2 font-semibold text-lg ${
                    parseInt(inputValue[quesNumber], 10) === Number(quiz.answer)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parseInt(inputValue[quesNumber], 10) ===
                  Number(quiz.answer) ? (
                    <span>Correct ✅</span>
                  ) : (
                    <span>Wrong ❌</span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between w-full">
            <button
              onClick={() => setQuesNumber(Math.max(0, quesNumber - 1))}
              className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              Previous
            </button>
            <button
              onClick={() =>
                quesNumber === data.length - 1 ? handleSubmit() : handleNext()
              }
              className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              {quesNumber === data.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Previous Quiz Results:</h3>
        {quizHistory.map((history, index) => (
          <p key={index} className="text-md">
            {history.date} - Score: {history.score} / {history.totalQuestions}
          </p>
        ))}
      </div>
    </div>
  );
};

export default QuizComponent;
