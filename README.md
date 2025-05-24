# Quiz Card Generator

A React application that converts content from Word or PDF documents into quiz flashcards, with the ability to download cards as images.

## Features

- Upload Word (.docx) documents
- Automatically generate quiz questions from document content
- Browse through flashcards with question and answer sides
- Download flashcards as PNG images
- Modern, responsive UI with TailwindCSS

## Technologies Used

- React 18
- TypeScript
- Vite
- TailwindCSS
- Mammoth.js (for Word document processing)
- html-to-image (for image generation)
- file-saver (for downloading images)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

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

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Usage

1. Click on "Upload Document" and select a Word (.docx) file
2. Specify the number of questions to generate
3. The app will process your document and generate quiz questions
4. Navigate through the flashcards using the Previous/Next buttons
5. Click on a card to flip between question and answer
6. Click "Download as Image" to save the current card as a PNG file

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
