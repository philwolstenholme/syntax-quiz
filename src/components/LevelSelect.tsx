import { Code2, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { levels } from '../data/questions';
import { PageLayout } from './PageLayout';

export const LevelSelect = () => {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Syntax Quiz
          </h1>
          <p className="text-gray-600 text-lg">
            Test your TypeScript & JavaScript knowledge
          </p>
        </div>

        <div className="space-y-4">
          {levels.map((level) => (
            <Link
              key={level.id}
              to={`/level/${level.id}/questions`}
              className="block w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] p-6 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${level.color} flex items-center justify-center shadow-md`}>
                    <span className="text-2xl font-bold text-white">{level.id}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {level.name}
                      </h2>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${level.color} text-white`}>
                        {level.subtitle}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {level.description}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {level.questions.length} questions
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Choose a level to begin practicing
        </p>
      </div>
    </PageLayout>
  );
};
