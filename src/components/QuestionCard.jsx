export const QuestionCard = ({ question, isDragOver, onDragOver, onDragLeave, onDrop }) => {
  const { code, highlight } = question;

  const before = code.substring(0, highlight.start);
  const highlighted = code.substring(highlight.start, highlight.end);
  const after = code.substring(highlight.end);

  return (
    <div
      className="bg-white rounded-3xl shadow-xl p-8 mb-6"
      style={{ viewTransitionName: 'question-card' }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {question.question}
      </h2>
      <p className="text-gray-600 mb-6 text-lg">
        💡 Drag an answer onto the code snippet or click an answer below
      </p>
      <div
        data-dropzone
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          ${isDragOver ? 'ring-4 ring-indigo-500 scale-[1.02]' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center z-10">
            <span className="text-2xl font-bold text-indigo-600">
              Drop here! 🎯
            </span>
          </div>
        )}
        <pre className="bg-gray-900 p-6 rounded-xl overflow-x-auto text-base leading-relaxed">
          <code className="font-mono text-gray-300">{before}<span className="bg-yellow-300 text-gray-900 px-1 rounded font-bold">{highlighted}</span>{after}</code>
        </pre>
      </div>
    </div>
  );
};
