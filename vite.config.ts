import path from "path"
import dns from "dns"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Resolve localhost for Node v16 and older.
// @see https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder("verbatim")

export default defineConfig({
  plugins: [react()],
  // Backwards-compat with Gatsby.
  publicDir: "static",
  build: {
    outDir: "public",
  },
  resolve: {
    alias: {
      gatsby: path.resolve(__dirname, "src/compat/gatsby-compat.tsx"),
    },
  },
  define: {
    "process.env": process.env,
    "window.global": typeof window !== "undefined" ? window : {},
  },
  optimizeDeps: {
    exclude: ["typeorm", "medusa-interfaces"],
  },
})
