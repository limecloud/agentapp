import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(root, '..')
const docsRoot = join(repoRoot, 'docs')
const publicRoot = join(docsRoot, 'public', 'markdown')
const ignoredTopLevel = new Set(['.vitepress', 'public'])
const llmAssetNames = ['llm.txt', 'llms.txt', 'llm-full.txt', 'llms-full.txt']

function toRepoPath(path) {
  return path.split('\\').join('/')
}

function copyMarkdownFiles(fromDir) {
  for (const entry of readdirSync(fromDir).sort()) {
    const source = join(fromDir, entry)
    const stats = statSync(source)

    if (stats.isDirectory()) {
      if (fromDir === docsRoot && ignoredTopLevel.has(entry)) continue
      copyMarkdownFiles(source)
      continue
    }

    if (!entry.endsWith('.md')) continue

    const target = join(publicRoot, relative(docsRoot, source))
    mkdirSync(dirname(target), { recursive: true })
    cpSync(source, target)
  }
}

function collectMarkdownFiles(fromDir) {
  const files = []

  for (const entry of readdirSync(fromDir).sort()) {
    const source = join(fromDir, entry)
    const stats = statSync(source)

    if (stats.isDirectory()) {
      if (fromDir === docsRoot && ignoredTopLevel.has(entry)) continue
      files.push(...collectMarkdownFiles(source))
      continue
    }

    if (!entry.endsWith('.md')) continue
    files.push(toRepoPath(relative(repoRoot, source)))
  }

  return files
}

function syncLlmAssets() {
  const sourceFiles = ['README.md', ...collectMarkdownFiles(docsRoot)]
  const fullText = `${sourceFiles
    .map((sourceFile) => {
      const body = readFileSync(join(repoRoot, sourceFile), 'utf8').trimEnd()
      return `<!-- Source: ${sourceFile} -->\n\n${body}`
    })
    .join('\n\n')}\n`

  writeFileSync(join(repoRoot, 'llm-full.txt'), fullText)
  writeFileSync(join(repoRoot, 'llms-full.txt'), fullText)

  for (const assetName of llmAssetNames) {
    cpSync(join(repoRoot, assetName), join(docsRoot, 'public', assetName))
  }
}

if (existsSync(publicRoot)) rmSync(publicRoot, { recursive: true, force: true })
mkdirSync(publicRoot, { recursive: true })
copyMarkdownFiles(docsRoot)
syncLlmAssets()
