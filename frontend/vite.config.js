import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
    base: '',
    plugins: [
        react(), 
        viteTsconfigPaths(),
        tailwindcss()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx',],
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {    
        open: true,
        port: 5173, 
    },

})