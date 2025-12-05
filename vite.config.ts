import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode, isSsrBuild }) => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ["@mui/material", "@emotion/react", "@emotion/styled"],
  },
  build: {
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            manualChunks: {
              "mui-core": ["@mui/material"],
            },
          },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
}));
