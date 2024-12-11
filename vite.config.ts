import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        watch: {
            usePolling: true, // Use polling if you're on WSL, Docker, or a network file system
        },
    },
});

