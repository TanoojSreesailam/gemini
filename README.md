Gemini Frontend Clone
This repository contains a fully functional, responsive frontend clone of a conversational AI chat application, built as an assignment for Kuvaka Tech. The application simulates OTP authentication, client-side chat management (CRUD), message handling, and AI response throttling, focusing on robust component architecture and modern UX/UI.

🚀 Project Overview & Live Demo
Feature

Implementation

Authentication

Simulated OTP flow using React Hook Form + Zod and restcountries.com for dial codes.

State Management

Zustand store with persistence via localStorage.

Chat Functionality

Simulated AI responses (setTimeout + Throttling), Reverse Infinite Scroll (Pagination), and Image Uploads (Base64).

UX/UI

Mobile-responsive design, Dark Mode toggle, Toast Notifications, and Loading Skeletons.

Performance

Debouncing for search input.

🔗 Live Deployment Link: [Insert Vercel/Netlify URL Here]
🔗 GitHub Repository Link: [Insert GitHub URL Here]

🛠️ Setup and Run Instructions
This project uses Next.js with the App Router.

Prerequisites
Node.js (v18+)

npm or yarn

Installation
Clone the repository:

git clone [YOUR_REPO_URL]
cd gemini-clone

Install dependencies:

npm install
# or
yarn install

Run the development server:

npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to view the application.

📁 Folder and Component Structure
The project follows a modular approach, keeping reusable logic in the src/ directory:

src/
├── components/            # Contains all UI components, grouped by feature
│   ├── Auth/              # Login flow components
│   ├── Chat/              # Chat interface, input, and message list
│   └── Dashboard/         # Sidebar/ChatList management
├── hooks/                 # Reusable React hooks (e.g., useCountryCodes)
├── lib/                   # Non-React utilities
│   ├── aiSimulation.js    # Logic for delayed AI reply
│   ├── utils.js           # Debounce, throttle, copyToClipboard
│   └── validationSchema.js# Zod validation schemas
├── store/                 # Global state management (Zustand)
│   └── useAppStore.js
└── App.jsx                # Main layout, theme, and authentication router

⚙️ Implementation Details for Core Features
1. Form Validation (React Hook Form + Zod)
Zod Schemas: Validation rules are defined in src/lib/validationSchema.js for the phone number and OTP fields.

Implementation: The AuthScreen.jsx component uses the useForm hook along with the zodResolver to enforce rules on submission and display inline error messages.

2. Throttling and Debouncing
Both are implemented in src/lib/utils.js and utilized via the useCallback hook in components for performance:

Debouncing: Used in src/components/Dashboard/ChatList.jsx to filter the chat list. The search input handler waits 300ms after the user stops typing before triggering the filter function, preventing excessive re-renders.

Throttling (AI Response): Handled by the simulateAiResponse function in src/lib/aiSimulation.js. The AI reply is intentionally delayed using setTimeout (simulating "thinking") to fulfill the throttling requirement and trigger the "Gemini is typing..." indicator.

3. Client-Side Pagination & Reverse Infinite Scroll
This complex chat behavior is managed entirely within src/components/Chat/MessageList.jsx:

Pagination: Messages are loaded in batches of 20 messages per page. The page state determines which subset of messages to display.

Reverse Infinite Scroll:

A useEffect monitors the chatContainerRef's scroll position.

When the user scrolls near the top of the container (scrollTop < 10), the loadNextPage function is called.

loadNextPage increments the page state, which causes useMemo to load the next older batch of 20 messages.

Scroll position is adjusted after loading to maintain the user's view (preventing a visual "jump").

4. Image Upload
The chat input allows image selection. In src/components/Chat/ChatInput.jsx, the image file is read using FileReader and immediately converted to a Base64 string. This string is then stored directly in the message payload in the Zustand store, allowing the image to be displayed in the chat without a backend upload service
