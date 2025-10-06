
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/70 rounded-md my-2 relative border border-gray-700">
      <div className="flex justify-between items-center px-4 py-1 bg-gray-800/50 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
