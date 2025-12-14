import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { downloadCodeAsFile } from '../utils/fileDownload'

export default function Message({ message }) {
  const renderContent = (content) => {
    const parts = content.split(/(```[\w]*\n[\s\S]*?```)/)
    const elements = []

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (part.startsWith('```')) {
          const match = part.match(/```([\w]*)\n([\s\S]*?)```/)
        if (match) {
          const lang = match[1] || 'html'
          const code = match[2]
          elements.push(
            <div key={i} className="relative">
              <SyntaxHighlighter language={lang} style={dark}>
                {code}
              </SyntaxHighlighter>
            {lang === 'html' ? (
              <button
                onClick={() => {
                  const blob = new Blob([code], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-green-700 text-white rounded hover:bg-green-600"
              >
                🚀 Launch
              </button>
            ):(
            <button
                onClick={() => downloadCodeAsFile(code, `code.${lang === 'python' ? 'py' : lang}`)}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Download
              </button>
            )}
            </div>
          )
        }
      } else {
        elements.push(<span key={i}>{part}</span>)
      }
    }

    return elements
  }

  return (
    <div className={`${
      message.role === 'user'
        ? 'max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-l-lg'
        : 'max-w-3xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-r-lg'
    } p-4 rounded-t-lg shadow-lg`}>
      <div className={`prose prose-sm max-w-none dark:prose-invert ${
        message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
      }`}>
        {renderContent(message.content)}
      </div>
    </div>
  )
}
