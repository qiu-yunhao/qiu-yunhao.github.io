import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import kotlin from 'highlight.js/lib/languages/kotlin'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('kt', kotlin)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('text', plaintext)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('xml', xml)

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')

const isAbsoluteUrl = (value) => /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('data:')

const resolveUrl = (url, baseUrl) => {
  if (!url || !baseUrl || isAbsoluteUrl(url) || url.startsWith('#')) {
    return url
  }

  try {
    return new URL(url, baseUrl).toString()
  } catch {
    return url
  }
}

const parseInline = (value, options = {}) => {
  const { baseUrl = '' } = options
  const escaped = escapeHtml(value)

  return escaped
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_, alt, url) => `<img src="${resolveUrl(url, baseUrl)}" alt="${alt}" loading="lazy" />`,
    )
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, text, url) => `<a href="${resolveUrl(url, baseUrl)}" target="_blank" rel="noreferrer">${text}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

const flushParagraph = (buffer, html, options) => {
  if (!buffer.length) {
    return
  }

  html.push(`<p>${parseInline(buffer.join(' '), options)}</p>`)
  buffer.length = 0
}

const flushList = (listType, items, html, options) => {
  if (!listType || !items.length) {
    return
  }

  const tag = listType === 'ol' ? 'ol' : 'ul'
  html.push(`<${tag}>${items.map((item) => `<li>${parseInline(item, options)}</li>`).join('')}</${tag}>`)
  items.length = 0
}

const splitTableRow = (value) =>
  value
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

const isTableSeparator = (value) => {
  const cells = splitTableRow(value)

  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

const getTableAlign = (value) => {
  if (value.startsWith(':') && value.endsWith(':')) {
    return 'center'
  }

  if (value.endsWith(':')) {
    return 'right'
  }

  if (value.startsWith(':')) {
    return 'left'
  }

  return ''
}

const buildTableHtml = (headerLine, separatorLine, bodyLines, options) => {
  const headers = splitTableRow(headerLine)
  const aligns = splitTableRow(separatorLine).map(getTableAlign)
  const rows = bodyLines.map(splitTableRow)

  const headerHtml = headers
    .map((cell, index) => {
      const align = aligns[index] ? ` style="text-align:${aligns[index]}"` : ''
      return `<th${align}>${parseInline(cell, options)}</th>`
    })
    .join('')

  const bodyHtml = rows
    .map((cells) => {
      const rowHtml = headers
        .map((_, index) => {
          const align = aligns[index] ? ` style="text-align:${aligns[index]}"` : ''
          return `<td${align}>${parseInline(cells[index] ?? '', options)}</td>`
        })
        .join('')

      return `<tr>${rowHtml}</tr>`
    })
    .join('')

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`
}

const highlightCodeBlock = (code, language) => {
  const normalizedLanguage = language.toLowerCase()
  const highlighted = normalizedLanguage && hljs.getLanguage(normalizedLanguage)
    ? hljs.highlight(code, { language: normalizedLanguage, ignoreIllegals: true }).value
    : hljs.highlightAuto(code).value
  const languageBadge = normalizedLanguage || 'code'
  const languageClass = normalizedLanguage ? ` language-${escapeHtml(normalizedLanguage)}` : ''

  return [
    `<pre class="code-block${languageClass}" data-language="${escapeHtml(languageBadge)}">`,
    `<code class="hljs${languageClass}">${highlighted}</code>`,
    '</pre>',
  ].join('')
}

export const parseMarkdown = (source, options = {}) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const html = []
  const headings = []
  const paragraph = []
  const listItems = []
  let listType = null
  let inCodeBlock = false
  let codeFence = ''
  let codeLang = ''
  let codeLines = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()

    if (/^<!--.*-->$/.test(trimmed)) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)
      continue
    }

    if (trimmed.startsWith('```')) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)

      if (!inCodeBlock) {
        inCodeBlock = true
        codeFence = trimmed
        codeLang = trimmed.slice(3).trim()
        codeLines = []
      } else if (trimmed === codeFence || trimmed === '```') {
        html.push(highlightCodeBlock(codeLines.join('\n'), codeLang))
        inCodeBlock = false
        codeFence = ''
        codeLang = ''
        codeLines = []
      }

      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)

      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = slugify(text)
      headings.push({ level, text, id })
      html.push(`<h${level} id="${id}">${parseInline(text, options)}</h${level}>`)
      continue
    }

    const nextTrimmed = lines[index + 1]?.trim() ?? ''
    if (trimmed.includes('|') && isTableSeparator(nextTrimmed)) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)
      listType = null

      const bodyLines = []
      let cursor = index + 2
      while (cursor < lines.length) {
        const tableLine = lines[cursor].trim()
        if (!tableLine || !tableLine.includes('|')) {
          break
        }
        bodyLines.push(lines[cursor])
        cursor += 1
      }

      html.push(buildTableHtml(line, lines[index + 1], bodyLines, options))
      index = cursor - 1
      continue
    }

    if (!trimmed) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)
      continue
    }

    if (trimmed === '---') {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)
      html.push('<hr />')
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph(paragraph, html, options)
      flushList(listType, listItems, html, options)
      html.push(`<blockquote><p>${parseInline(trimmed.slice(2), options)}</p></blockquote>`)
      continue
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
    if (orderedMatch) {
      flushParagraph(paragraph, html, options)
      if (listType && listType !== 'ol') {
        flushList(listType, listItems, html, options)
      }
      listType = 'ol'
      listItems.push(orderedMatch[1])
      continue
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/)
    if (unorderedMatch) {
      flushParagraph(paragraph, html, options)
      if (listType && listType !== 'ul') {
        flushList(listType, listItems, html, options)
      }
      listType = 'ul'
      listItems.push(unorderedMatch[1])
      continue
    }

    flushList(listType, listItems, html, options)
    listType = null
    paragraph.push(trimmed)
  }

  flushParagraph(paragraph, html, options)
  flushList(listType, listItems, html, options)

  if (codeLines.length) {
    html.push(highlightCodeBlock(codeLines.join('\n'), codeLang))
  }

  return {
    html: html.join('\n'),
    headings,
  }
}
