import { Flame, Star } from 'lucide-react';

export const QuizHeader = ({ score, streak, currentQuestionIndex, totalQuestions, level }) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`flex items-center h-9 text-sm px-3 sm:px-4 rounded-xl bg-gradient-to-r ${level.color} text-white font-bold`}>
            {level.name}
          </span>
          <div className="flex items-center gap-2 h-9 bg-orange-500 text-white px-3 sm:px-4 rounded-xl font-bold">
            <Flame size={20} />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-2 h-9 bg-yellow-500 text-white px-3 sm:px-4 rounded-xl font-bold">
            <Star size={20} />
            <span>{score}</span>
          </div>
        </div>
        <div className="text-gray-600 font-semibold">
          {currentQuestionIndex + 1} / {totalQuestions}
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
