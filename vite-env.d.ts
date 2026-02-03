interface ImportMetaEnv {
    readonly VITE_API_KEY: string
    readonly VITE_OPENROUTER_API_KEY: string
    readonly VITE_FREEPIK_API_KEY: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
