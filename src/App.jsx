import { useState, useEffect } from 'react'
import Message from './components/Message'
import InputArea from './components/InputArea'
import { sendPromptToModel } from './utils/api'

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [modelMode, setModelMode] = useState('local')
  const [defaultLanguage, setDefaultLanguage] = useState('html')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [localUrl, setLocalUrl] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)

    // Load API settings
    setLocalUrl(localStorage.getItem('localUrl'))
    setApiUrl(localStorage.getItem('apiUrl'))
    setApiKey(localStorage.getItem('apiKey'))
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  const handleLocalUrlChange = (e) => {
    const value = e.target.value
    setLocalUrl(value)
    localStorage.setItem('localUrl', value)
  }

  const handleApiUrlChange = (e) => {
    const value = e.target.value
    setApiUrl(value)
    localStorage.setItem('apiUrl', value)
  }

  const handleApiKeyChange = (e) => {
    const value = e.target.value
    setApiKey(value)
    localStorage.setItem('apiKey', value)
  }

  const handleSendMessage = async (prompt) => {
    let modifiedPrompt = prompt
    const lowerPrompt = prompt.toLowerCase()
    const lowerLang = defaultLanguage.toLowerCase()
    if (defaultLanguage !== 'none' &&
        !lowerPrompt.includes(lowerLang) &&
        !lowerPrompt.includes(defaultLanguage === 'javascript' ? 'js' : defaultLanguage) &&
        !(lowerPrompt.includes('html') && defaultLanguage === 'html')) {
      modifiedPrompt = prompt + ' in ' + defaultLanguage
    }
    const userMessage = { role: 'user', content: modifiedPrompt }

    // Add user message and initial assistant message
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '' }])
    setLoading(true)

    try {
      let currentContent = ''
      await sendPromptToModel(modifiedPrompt, modelMode, (chunk) => {
        currentContent += chunk
        setMessages(prev => {
          const newMessages = [...prev]
          // Update the last message (assistant message)
          newMessages[newMessages.length - 1] = { role: 'assistant', content: currentContent }
          return newMessages
        })
      }, localUrl, apiUrl, apiKey)
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = { role: 'assistant', content: 'Sorry, there was an error processing your request.' }
        return newMessages
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black text-white shadow-lg p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pig Tim's Gaming Factory</h1>
        <img src ='./src/asset/1.png' width='40' height='40'/>
        <img src ='./src/asset/1.png' width='50' height='50'/>
        <img src ='./src/asset/2.png' width='60' height='60'/>
        <img src ='./src/asset/pig.gif' width='70' height='70'/>
        <img src ='./src/asset/7.png' width='60' height='60'/>
        <img src ='./src/asset/8.png' width='50' height='50'/>
        <img src ='./src/asset/8.png' width='40' height='40'/>
        <div className="flex items-center space-x-2">
          <select
            value={modelMode}
            onChange={(e) => setModelMode(e.target.value)}
            className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="local">Local Model</option>
            <option value="api">Agent API</option>
          </select>
          <button
            onClick={() => setShowLanguageMenu(true)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Open Menu"
          >
            ☰
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 max-w-4xl mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Message message={msg} />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl p-4 rounded-r-lg rounded-t-lg shadow-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {/* <div className="animate-pulse">Generating code...</div> */}
              <div className="animate-pulse">Cooking your GAME...</div>
            </div>
          </div>
        )}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
      {/* Language Menu Slide Out */}
      {showLanguageMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowLanguageMenu(false)}></div>
      )}
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-lg transform ${showLanguageMenu ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50`}>
        <div className="p-4 relative">
          <h3 className="text-white text-lg mb-4">Settings</h3>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Language</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
            >
              <option value="html">HTML</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="css">CSS</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Theme</label>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Local URL</label>
            <input
              type="text"
              value={localUrl}
              onChange={handleLocalUrlChange}
              className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={handleApiUrlChange}
              className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
            />
          </div>
          <button onClick={() => setShowLanguageMenu(false)} className="absolute top-4 right-4 text-white text-2xl hover:text-gray-400">&times;</button>
        </div>
      </div>
    </div>
  )
}

export default App
