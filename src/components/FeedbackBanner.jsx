import { CheckCircle, XCircle } from 'lucide-react';

export const FeedbackBanner = ({ lastAnswer }) => {
  if (!lastAnswer) return null;

  return (
    <div
      className={`rounded-2xl p-4 mb-6 flex items-center gap-3 font-bold text-lg ${
        lastAnswer.correct
          ? 'bg-green-50 text-green-700 border-2 border-green-500'
          : 'bg-red-50 text-red-700 border-2 border-red-500'
      }`}
      style={{ viewTransitionName: 'feedback-banner' }}
    >
      {lastAnswer.correct ? (
        <>
          <CheckCircle size={24} />
          <span>Correct! {lastAnswer.term}</span>
        </>
      ) : (
        <>
          <XCircle size={24} />
          <span>
            Wrong! It was {lastAnswer.term}, not {lastAnswer.userAnswer}
          </span>
        </>
      )}
    </div>
  );
};
