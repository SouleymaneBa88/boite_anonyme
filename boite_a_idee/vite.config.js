import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars regardless of the 'VITE_' prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // Vite configuration options
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // Example usage of loaded env variable
          changeOrigin: true,
        },
      },
    },
  }
})
