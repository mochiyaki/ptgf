# Project Structure

```
pig-tims-gaming-factory/
├── .env
├── index.html
├── package.json
├── postcss.config.js
├── presentation.pptx
├── README.md
├── tailwind.config.js
└── vite.config.js

├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── InputArea.jsx
│   │   └── Message.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── fileDownload.js
│   └── asset/
│       ├── 1.png
│       ├── 2.png
│       ├── 7.png
│       ├── 8.png
│       └── pig.gif

├── node_modules/ (not shown)
└── dist/ (not shown, generated during build)
```

## Detailed Component Structure

### Main Application (`src/App.jsx`)
- Handles state management for messages, loading, theme, model mode, and language settings
- Manages the chat interface with user and assistant messages
- Implements dark/light mode toggle with localStorage persistence
- Controls model switching between local and agent API
- Manages language selection for code generation

### Components (`src/components/`)
- **InputArea.jsx**:
  - Text input area with voice support
  - Handles sending messages to the AI model
  - Integrates speech recognition for voice input

- **Message.jsx**:
  - Displays individual chat messages
  - Renders assistant responses with syntax highlighting
  - Provides download functionality for generated code

### Utilities (`src/utils/`)
- **api.js**:
  - Handles communication with local LLM and agent API
  - Manages different endpoints for local model vs agent API
  - Implements error handling for API calls

- **fileDownload.js**:
  - Provides functionality to download generated code as files
  - Supports various file formats (HTML, JS, Python, CSS)

### Assets (`src/asset/`)
- Various PNG images used in the UI
- Animated GIF (pig.gif) for visual appeal