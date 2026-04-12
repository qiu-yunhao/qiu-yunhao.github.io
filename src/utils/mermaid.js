const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

let mermaidModulePromise

const getMermaid = async () => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'neutral',
      })

      return mermaid
    })
  }

  return mermaidModulePromise
}

export const renderMermaidDiagrams = async (container) => {
  if (!container) {
    return
  }

  const diagramNodes = [...container.querySelectorAll('.mermaid')]
  if (!diagramNodes.length) {
    return
  }

  const mermaid = await getMermaid()

  for (const node of diagramNodes) {
    const source = node.textContent?.trim() ?? ''
    if (!source) {
      continue
    }

    try {
      await mermaid.run({ nodes: [node] })

      const svg = node.querySelector('svg')
      if (svg) {
        svg.removeAttribute('height')
        svg.style.maxWidth = '100%'
      }
    } catch (error) {
      node.classList.add('mermaid-failed')
      node.innerHTML = [
        '<p class="mermaid-fallback-title">Mermaid 流程图渲染失败，以下是原始定义：</p>',
        `<pre class="mermaid-fallback-source" data-language="mermaid"><code>${escapeHtml(source)}</code></pre>`,
      ].join('')
    }
  }
}
