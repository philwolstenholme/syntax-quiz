import { useEffect } from 'react';
import { useParams, useLocation, useSearch, Link } from 'wouter';
import { Trophy, Target, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { StatCard } from '../components/StatCard';
import { levels } from '../data/questions';

export const ScorePage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const levelId = parseInt(params.levelId ?? '0', 10);
  const level = levels.find((l) => l.id === levelId);

  const completed = searchParams.get('completed');
  const score = parseInt(searchParams.get('score') || '0', 10);
  const correctAnswers = parseInt(searchParams.get('correct') || '0', 10);
  const totalQuestions = parseInt(searchParams.get('total') || '0', 10);

  const isValidAccess = completed === 'true' && totalQuestions > 0 && level;

  // Redirect to home if invalid access
  useEffect(() => {
    if (!isValidAccess) {
      setLocation('/');
    }
  }, [isValidAccess, setLocation]);

  // Show nothing while redirecting
  if (!isValidAccess) {
    return null;
  }

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <PageLayout centered>
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
        <div className="mb-6">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Quiz Complete!
        </h1>

        <div className="mb-6">
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white`}>
            {level.name} - {level.subtitle}
          </span>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-8 mb-8">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <div className="text-xl">Total Score</div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <StatCard icon={Target} iconColor="text-indigo-500" value={`${accuracy}%`} label="Accuracy" />
          <StatCard icon={CheckCircle} iconColor="text-green-500" value={correctAnswers} label="Correct" />
        </div>

        <div className="space-y-3">
          <Link
            to={`/level/${levelId}/questions`}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Link>

          <Link
            to="/"
            className="w-full bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Choose Another Level
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};
