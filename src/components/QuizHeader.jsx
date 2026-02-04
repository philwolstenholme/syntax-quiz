import { Flame, Star } from 'lucide-react';

export const QuizHeader = ({ score, streak, currentQuestion, totalQuestions, level }) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {level && (
            <span className={`text-sm font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r ${level.color} text-white`}>
              {level.name}
            </span>
          )}
          <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold">
            <Flame size={20} />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold">
            <Star size={20} />
            <span>{score}</span>
          </div>
        </div>
        <div className="text-gray-600 font-semibold">
          Question {currentQuestion + 1} / {totalQuestions}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
