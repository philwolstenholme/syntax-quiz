import { Trophy, Target, CheckCircle } from 'lucide-react';

export const CompletionScreen = ({ score, correctAnswers, totalQuestions, onRestart }) => {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        <div className="mb-6">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Quiz Complete!
        </h1>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-8 mb-8">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <div className="text-xl">Total Score</div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <Target className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{accuracy}%</div>
            <div className="text-gray-600 mt-1">Accuracy</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{correctAnswers}</div>
            <div className="text-gray-600 mt-1">Correct</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          Practice Again
        </button>
      </div>
    </div>
  );
};
