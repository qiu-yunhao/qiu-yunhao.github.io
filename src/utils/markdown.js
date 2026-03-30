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

const parseInline = (value) => {
  const escaped = escapeHtml(value)

  return escaped
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

const flushParagraph = (buffer, html) => {
  if (!buffer.length) {
    return
  }

  html.push(`<p>${parseInline(buffer.join(' '))}</p>`)
  buffer.length = 0
}

const flushList = (listType, items, html) => {
  if (!listType || !items.length) {
    return
  }

  const tag = listType === 'ol' ? 'ol' : 'ul'
  html.push(`<${tag}>${items.map((item) => `<li>${parseInline(item)}</li>`).join('')}</${tag}>`)
  items.length = 0
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

export const parseMarkdown = (source) => {
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

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^<!--.*-->$/.test(trimmed)) {
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)
      continue
    }

    if (trimmed.startsWith('```')) {
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)

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
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)

      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = slugify(text)
      headings.push({ level, text, id })
      html.push(`<h${level} id="${id}">${parseInline(text)}</h${level}>`)
      continue
    }

    if (!trimmed) {
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)
      continue
    }

    if (trimmed === '---') {
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)
      html.push('<hr />')
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph(paragraph, html)
      flushList(listType, listItems, html)
      html.push(`<blockquote><p>${parseInline(trimmed.slice(2))}</p></blockquote>`)
      continue
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/)
    if (orderedMatch) {
      flushParagraph(paragraph, html)
      if (listType && listType !== 'ol') {
        flushList(listType, listItems, html)
      }
      listType = 'ol'
      listItems.push(orderedMatch[1])
      continue
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/)
    if (unorderedMatch) {
      flushParagraph(paragraph, html)
      if (listType && listType !== 'ul') {
        flushList(listType, listItems, html)
      }
      listType = 'ul'
      listItems.push(unorderedMatch[1])
      continue
    }

    flushList(listType, listItems, html)
    listType = null
    paragraph.push(trimmed)
  }

  flushParagraph(paragraph, html)
  flushList(listType, listItems, html)

  if (codeLines.length) {
    html.push(highlightCodeBlock(codeLines.join('\n'), codeLang))
  }

  return {
    html: html.join('\n'),
    headings,
  }
}
