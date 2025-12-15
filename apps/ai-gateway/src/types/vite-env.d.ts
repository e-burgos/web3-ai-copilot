// Type declarations for Vite's import.meta.env
// This allows TypeScript to compile files that use import.meta.env
// even though we're in a Node.js environment

interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | undefined;
    readonly VITE_ZERION_API_KEY?: string;
  };
}
