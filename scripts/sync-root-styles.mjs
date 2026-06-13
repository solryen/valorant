import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(rootDir, '..')
const sourceCssPath = path.join(projectRoot, 'src', 'index.css')
const publicCssPath = path.join(projectRoot, 'public', 'index.css')

await mkdir(path.dirname(publicCssPath), { recursive: true })
await copyFile(sourceCssPath, publicCssPath)

console.log(`Synced ${sourceCssPath} -> ${publicCssPath}`)
