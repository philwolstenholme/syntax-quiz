import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export const QuestionCard = ({ question, isDragOver, onDragOver, onDragLeave, onDrop }) => {
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(question.code, {
          lang: 'typescript',
          theme: 'github-dark',
          decorations: [
            {
              start: question.highlight.start,
              end: question.highlight.end,
              properties: {
                class: 'highlighted-code'
              }
            }
          ]
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        setHighlightedCode(`<pre><code>${question.code}</code></pre>`);
      }
    };

    highlightCode();
  }, [question]);

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
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          ${isDragOver ? 'ring-4 ring-indigo-500 scale-102' : ''}
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
        <div
          className="shiki-container overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
};
