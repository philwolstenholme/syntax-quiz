import { CheckCircle, XCircle } from 'lucide-react';
import { getMdnUrl } from '../utils/mdnLinks';

const MdnLink = ({ term, className }) => (
  <a
    href={getMdnUrl(term)}
    target="_blank"
    rel="noopener noreferrer"
    className={`underline decoration-2 underline-offset-2 hover:opacity-80 ${className}`}
  >
    {term}
  </a>
);

export const FeedbackBanner = ({ lastAnswer }) => {
  if (!lastAnswer) return null;

  return (
    <div
      className={`rounded-2xl p-4 mb-6 flex items-center gap-3 font-bold text-lg ${
        lastAnswer.correct
          ? 'bg-green-50 text-green-700 border-2 border-green-500'
          : 'bg-red-50 text-red-700 border-2 border-red-500'
      }`}
    >
      {lastAnswer.correct ? (
        <>
          <CheckCircle size={24} />
          <span>
            Correct! <MdnLink term={lastAnswer.term} className="text-green-800" />
          </span>
        </>
      ) : (
        <>
          <XCircle size={24} />
          <span>
            Wrong! It was <MdnLink term={lastAnswer.term} className="text-red-800" />, not{' '}
            {lastAnswer.userAnswer}
          </span>
        </>
      )}
    </div>
  );
};
