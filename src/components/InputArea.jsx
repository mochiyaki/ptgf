import { useState, useEffect } from 'react'

export default function InputArea({ onSendMessage }) {
  const [prompt, setPrompt] = useState('')
  const [listening, setListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-US'
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setPrompt(prev => prev + transcript)
        setListening(false)
      }
      rec.onerror = (error) => {
        console.error('Speech recognition error:', error)
        setListening(false)
      }
      rec.onend = () => setListening(false)
      setRecognition(rec)
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition not supported in this browser.')
      return
    }
    if (listening) {
      recognition.stop()
      setListening(false)
    } else {
      recognition.start()
      setListening(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSendMessage(prompt)
      setPrompt('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-inner">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        // placeholder="Describe the code you want to generate..."
        placeholder="Describe the GAME you want to bake..."
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        rows={3}
      />
      <div className="mt-3 flex justify-end space-x-2">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!recognition}
          className={`px-4 py-2 rounded-lg transition-colors ${
            listening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 disabled:bg-gray-300 dark:disabled:bg-gray-700'
          }`}
          title={listening ? 'Stop listening' : 'Start voice input'}
        >
          🎤
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          // className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          {/* Send Prompt */}
          Bake
        </button>
      </div>
    </form>
  )
}
