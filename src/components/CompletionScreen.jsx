import { Trophy, Target, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export const CompletionScreen = ({ score, correctAnswers, totalQuestions, level, onRestart, onBackToLevels }) => {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        <div className="mb-6">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Quiz Complete!
        </h1>

        {level && (
          <div className="mb-6">
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white`}>
              {level.name} - {level.subtitle}
            </span>
          </div>
        )}

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

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={onBackToLevels}
            className="w-full bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Choose Another Level
          </button>
        </div>
      </div>
    </div>
  );
};
