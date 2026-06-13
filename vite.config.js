import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function mountStaticSubapp(server, prefix, htmlPath) {
  server.middlewares.use((req, res, next) => {
    const requestUrl = req.url || '/'
    const pathname = requestUrl.split('?')[0]

    if (!pathname.startsWith(prefix)) {
      next()
      return
    }

    const isAssetRequest = pathname.includes('.') && pathname !== `${prefix}/index.html`
    if (pathname === prefix || pathname === `${prefix}/` || !isAssetRequest) {
      if (fs.existsSync(htmlPath)) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(fs.readFileSync(htmlPath, 'utf8'))
        return
      }
    }

    next()
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'run-static-mount',
      configureServer(server) {
        mountStaticSubapp(server, '/run', path.resolve(process.cwd(), 'public/run/index.html'))
        mountStaticSubapp(server, '/explore', path.resolve(process.cwd(), 'public/explore/index.html'))
      },
      configurePreviewServer(server) {
        mountStaticSubapp(server, '/run', path.resolve(process.cwd(), 'dist/run/index.html'))
        mountStaticSubapp(server, '/explore', path.resolve(process.cwd(), 'dist/explore/index.html'))
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
