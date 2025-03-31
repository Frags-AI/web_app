import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from "path"

export default defineConfig({
    base: '',
    plugins: [
        react(), 
        viteTsconfigPaths(),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {    
        open: true,
        port: 5173, 
    },

})