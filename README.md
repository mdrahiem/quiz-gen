# Quiz Card Generator

A React application that converts content from Word or PDF documents into quiz flashcards with AI-powered multiple-choice questions, allowing users to download cards as images.

## Features

- Upload Word (.docx) or PDF documents
- Generate multiple-choice quiz questions from document content
- AI-powered question generation using Perplexity Sonar API
- Interactive flashcards with question and answer sides
- Download flashcards as PNG images
- Modern, responsive UI with TailwindCSS

## Technologies Used

- React 18
- TypeScript
- Vite
- TailwindCSS
- Mammoth.js (for Word document processing)
- PDF.js (for PDF document processing)
- html-to-image (for image generation)
- file-saver (for downloading images)
- Perplexity Sonar API (for AI-generated questions)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Perplexity API key (for AI-generated questions)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd quiz-gen
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables for AI features
```bash
cp .env.example .env
```
Then edit the `.env` file and add your Perplexity API key:
```
VITE_PERPLEXITY_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## Usage

1. Click on "Upload Document" and select a Word (.docx) or PDF file
2. Choose the number of questions to generate (only applies for basic generation)
3. Toggle "Use AI to generate better multiple-choice questions" if you have set up an API key
4. Upload your document and wait for the questions to be generated
5. Navigate through the flashcards using the Previous/Next buttons
6. Click on a card to flip between question and multiple-choice options
7. Click "Download as Image" to save the current card as a PNG file

## AI Question Generation

When the AI option is enabled, the application will:
1. Extract text from your document
2. Send the content to Perplexity Sonar API
3. Generate structured multiple-choice questions
4. Format the questions as interactive flashcards

The front of each card shows the question, and the back shows the multiple-choice options.

## Building for Production

```bash
npm run build
```

The build files will be output to the `dist` directory.

## Troubleshooting

- **API Key Issues**: Make sure your Perplexity API key is correctly set in the `.env` file
- **Document Processing**: For large documents, processing may take a few moments
- **PDF Support**: Complex PDFs with heavy formatting may not parse perfectly

## Building for Production

```bash
npm run build
```

The build files will be output to the `dist` directory.

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
