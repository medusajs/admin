import path from "path"
import { env } from "process"
import dns from "dns"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import dotenv from 'dotenv'

// Resolve localhost for Node v16 and older.
// @see https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder("verbatim")

dotenv.config()

console.log("medusaa api",env.MEDUSA_BACKEND_URL)

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
      "@reach/router": path.resolve(
        __dirname,
        "src/compat/reach-router-compat.tsx"
      ),
    },
  },
  define: {
//      __MEDUSA_BACKEND_URL__ : JSON.stringify({"MEDUSA_BACKEND_URL":"cs.local.api"}),	  
   __MEDUSA_BACKEND_URL__: JSON.stringify(
     env.MEDUSA_BACKEND_URL ||
       // Backwards-compat with Gatsby.
       env.GATSBY_MEDUSA_BACKEND_URL ||
       env.GATSBY_STORE_URL ||
       ""
   ),
       
  },
  optimizeDeps: {
    exclude: ["typeorm", "medusa-interfaces"],
  },
})
