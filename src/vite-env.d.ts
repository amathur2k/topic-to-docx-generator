/// <reference types="vite/client" />

// Add this declaration for .txt files
declare module '*.txt' {
  const content: string;
  export default content;
}
