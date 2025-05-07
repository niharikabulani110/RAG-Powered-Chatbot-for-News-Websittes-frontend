# RAG-Powered Chatbot for News Websites

A React-based frontend for a RAG (Retrieval-Augmented Generation) powered chatbot that can answer questions about news articles. This application provides a clean, modern chat interface with session management and real-time communication with the backend.

## Features

- 🎯 Clean, responsive chat interface built with React and Tailwind CSS
- 💬 Real-time chat functionality with the backend
- 🔄 Session management with persistent chat history
- 🎨 Modern UI with gradient backgrounds and smooth transitions
- 📱 Mobile-friendly design
- ⚡ Auto-scrolling to latest messages
- ⌨️ Enter key support for sending messages
- 🔄 Loading state indicators
- 🎯 Error handling for API requests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see Backend Setup)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RAG-Powered-Chatbot-for-News-Websittes-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Integration

The frontend communicates with the following backend endpoints:

### Chat Endpoint
- **URL**: `http://localhost:8000/chat`
- **Method**: POST
- **Body**: 
  ```json
  {
    "query": "string",
    "session_id": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "answer": "string"
  }
  ```

### History Endpoint
- **URL**: `http://localhost:8000/history/{session_id}`
- **Method**: GET
- **Response**: Array of previous messages

### Reset Endpoint
- **URL**: `http://localhost:8000/reset/{session_id}`
- **Method**: POST
- **Purpose**: Clears chat history and creates new session

## Session Management

The application implements session management using the following logic:

1. On first load, a new UUID is generated for the session
2. The session ID is stored in localStorage for persistence
3. All API requests include the session ID
4. The reset button:
   - Clears the current session
   - Generates a new session ID
   - Updates localStorage
   - Clears the chat history

## Features Implementation

### Chat Interface
- Messages are displayed in a scrollable container
- User messages are aligned left with blue background
- Bot messages are aligned right with green background
- Loading indicator shows "Typing..." while waiting for response
- Auto-scrolls to the latest message

### Input Handling
- Text input with placeholder
- Send button for submitting queries
- Reset button for clearing session
- Enter key support for sending messages
- Empty message prevention

### Error Handling
- API error handling with user-friendly messages
- Console logging for debugging
- Graceful fallback for failed requests

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

### Production
- react: ^19.1.0
- react-dom: ^19.1.0
- axios: ^1.9.0

### Development
- @vitejs/plugin-react: ^4.4.1
- autoprefixer: ^10.4.16
- postcss: ^8.4.31
- tailwindcss: ^3.4.1
- vite: ^6.3.5
- eslint and related plugins

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

3. Deploy the contents of the `dist` directory to your hosting service of choice (e.g., Vercel, Netlify, or a static file server)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
