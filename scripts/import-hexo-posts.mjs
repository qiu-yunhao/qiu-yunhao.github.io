import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const sourceDir = path.resolve(projectRoot, process.argv[2] ?? 'old_hexo_dev/source/_posts')
const contentDir = path.resolve(projectRoot, 'src/content/posts')
const postsFile = path.resolve(projectRoot, 'src/data/posts.js')

const ensureDirectory = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const toPosix = (value) => value.replaceAll(path.sep, '/')

const normalizeDate = (value) => {
  const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (!match) {
    return value.trim()
  }

  const [, year, month, day] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const slugify = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

const toAsciiSlug = (value, fallback) => {
  const base = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  return base || slugify(fallback) || 'post'
}

const parseScalarList = (value) => {
  if (!value) {
    return []
  }

  const normalized = value.trim()
  if (!normalized) {
    return []
  }

  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    return normalized
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return normalized
    .split(/[,\s]+/)
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

const parseFrontMatter = (raw) => {
  const match = raw.match(/^(---|----)\s*\n([\s\S]*?)\n\1\s*\n?([\s\S]*)$/)
  if (!match) {
    return {
      meta: {},
      body: raw,
    }
  }

  const [, , header, body] = match
  const meta = {}

  for (const line of header.split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) {
      continue
    }

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (key) {
      meta[key] = value
    }
  }

  return { meta, body }
}

const cleanBody = (body) =>
  body
    .replace(/\r\n/g, '\n')
    .replace(/^\uFEFF/, '')
    .replace(/<!--\s*more\s*-->/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .concat('\n')

const escapeJsString = (value) =>
  value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")

const toVarName = (slug, index) => {
  const base = slug
    .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')

  return `${base || 'hexoPost'}${index}Content`
}

const readPostsFile = () => fs.readFileSync(postsFile, 'utf8')

const collectExistingSlugs = (content) => {
  const slugs = new Set()
  const regex = /slug:\s*'([^']+)'/g

  for (const match of content.matchAll(regex)) {
    slugs.add(match[1])
  }

  return slugs
}

const insertImports = (content, imports) => {
  if (!imports.length) {
    return content
  }

  const importBlock = `${imports.join('\n')}\n`
  const matches = [...content.matchAll(/^import .*$/gm)]

  if (!matches.length) {
    return `${importBlock}\n${content}`
  }

  const lastImport = matches.at(-1)
  const insertAt = lastImport.index + lastImport[0].length
  return `${content.slice(0, insertAt)}\n${importBlock}${content.slice(insertAt)}`
}

const insertEntries = (content, entries) => {
  if (!entries.length) {
    return content
  }

  const marker = '\n]\n\nexport const getPostBySlug'
  const index = content.indexOf(marker)
  if (index === -1) {
    throw new Error('Could not find posts array boundary in src/data/posts.js')
  }

  const serialized = entries.map((entry) => `  {\n${entry}\n  },`).join('\n')
  return `${content.slice(0, index)}\n${serialized}${content.slice(index)}`
}

ensureDirectory(contentDir)

const sourceFiles = fs
  .readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

const postsFileContent = readPostsFile()
const existingSlugs = collectExistingSlugs(postsFileContent)
const importsToAdd = []
const entriesToAdd = []
const imported = []

for (const [index, file] of sourceFiles.entries()) {
  const inputPath = path.join(sourceDir, file.name)
  const raw = fs.readFileSync(inputPath, 'utf8')
  const { meta, body } = parseFrontMatter(raw)
  const title = meta.title?.trim() || path.basename(file.name, '.md')
  const slug = toAsciiSlug(path.basename(file.name, '.md'), title)

  if (existingSlugs.has(slug)) {
    continue
  }

  const outputPath = path.join(contentDir, `${slug}.md`)
  fs.writeFileSync(outputPath, cleanBody(body), 'utf8')

  const importPath = toPosix(path.relative(path.dirname(postsFile), outputPath))
  const importName = toVarName(slug, index + 1)
  const tags = parseScalarList(meta.tags)
  const categories = parseScalarList(meta.categories || meta.category)
  const description = `${title} (Imported from Hexo)`

  importsToAdd.push(`import ${importName} from '${importPath}?raw'`)
  entriesToAdd.push(
    [
      `    slug: '${escapeJsString(slug)}',`,
      `    title: '${escapeJsString(title)}',`,
      `    description: '${escapeJsString(description)}',`,
      `    date: '${escapeJsString(normalizeDate(meta.date || ''))}',`,
      `    category: '${escapeJsString(categories[0] || 'Archive')}',`,
      `    tags: [${tags.map((tag) => `'${escapeJsString(tag)}'`).join(', ')}],`,
      `    content: ${importName},`,
    ].join('\n'),
  )

  imported.push({
    title,
    slug,
    outputPath,
  })
}

if (importsToAdd.length || entriesToAdd.length) {
  const withImports = insertImports(postsFileContent, importsToAdd)
  const withEntries = insertEntries(withImports, entriesToAdd)
  fs.writeFileSync(postsFile, withEntries, 'utf8')
}

if (!imported.length) {
  console.log('No new Hexo posts were imported.')
} else {
  console.log(`Imported ${imported.length} Hexo posts:`)
  for (const post of imported) {
    console.log(`- ${post.slug}: ${post.outputPath}`)
  }
}
