import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Button = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-teal-400 min-h-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={() => setIsOpen(true)}
          className="relative px-6 py-3 font-bold text-white bg-black rounded-lg overflow-hidden group cursor-pointer hover:bg-white hover:text-black transition-all duration-300"
        >
          <span className="relative flex items-center gap-2 z-10 hover:text-green-500">
            <span className="transform transition-transform duration-300 group-hover:-translate-x-2">
              <PlayCircle />
            </span>
            Start Quiz
          </span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-10">
            <div className="bg-white text-black p-6 rounded-md shadow-lg w-[90%] max-w-lg animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black flex-1 text-center">
                  Quiz Instructions
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-auto cursor-pointer"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>

              <div className="text-left">
                <p className="mt-4 text-gray-700 text-lg font-semibold">
                  Read the instructions carefully before starting the quiz.
                </p>
                <ul className="mt-2 text-gray-600 list-disc list-inside">
                  <li>
                    For multiple-choice questions, select the one best answer
                    (A, B, C, or D).
                  </li>
                  <li>
                    For integer-type questions, write your numerical answer
                    clearly.
                  </li>
                  <li>No calculators unless specified.</li>
                  <li>You have 30 minutes to complete this quiz.</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-center ">
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                  // onClick={() => alert("Quiz Started!")}
                  onClick={() => navigate("/quiz")} // Navigate to /quiz
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Button;
