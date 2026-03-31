<template>
  <div class="markdown-body" v-html="rendered.html"></div>
</template>

<script setup>
import { computed } from 'vue'
import { parseMarkdown } from '@/utils/markdown'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    default: '',
  },
})

const rendered = computed(() => parseMarkdown(props.content, { baseUrl: props.baseUrl }))
</script>

<style scoped>
.markdown-body {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  color: var(--text-primary);
  line-height: 1.9;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 2em 0 0.7em;
  line-height: 1.25;
  color: var(--text-primary);
}

.markdown-body :deep(h1) {
  font-size: clamp(1.85rem, 4vw, 2.35rem);
}

.markdown-body :deep(h2) {
  font-size: clamp(1.45rem, 3vw, 1.8rem);
}

.markdown-body :deep(h3) {
  font-size: clamp(1.16rem, 2.3vw, 1.35rem);
}

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(blockquote),
.markdown-body :deep(pre) {
  margin: 1rem 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.4rem;
}

.markdown-body :deep(li + li) {
  margin-top: 0.4rem;
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

.markdown-body :deep(code) {
  padding: 0.15rem 0.4rem;
  border-radius: 0.5rem;
  background: var(--chip-glaze);
  border: 1px solid var(--chip-border);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.94em;
}

.markdown-body :deep(pre) {
  position: relative;
  width: 100%;
  max-width: 100%;
  padding: 3rem 1.1rem 1.1rem;
  overflow-x: auto;
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92)),
    linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(244, 114, 182, 0.08));
  color: #e5eefc;
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.markdown-body :deep(pre::before) {
  content: attr(data-language);
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
  border: 1px solid rgba(148, 163, 184, 0.16);
  color: #a5b4fc;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.markdown-body :deep(pre code) {
  display: block;
  padding: 0;
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 0.92rem;
  line-height: 1.75;
  text-shadow: none;
}

.markdown-body :deep(.hljs) {
  display: block;
  background: transparent;
  color: #e5eefc;
}

.markdown-body :deep(.hljs-comment),
.markdown-body :deep(.hljs-quote) {
  color: #7c8aa5;
  font-style: italic;
}

.markdown-body :deep(.hljs-keyword),
.markdown-body :deep(.hljs-selector-tag),
.markdown-body :deep(.hljs-type) {
  color: #f472b6;
}

.markdown-body :deep(.hljs-title),
.markdown-body :deep(.hljs-title.function_),
.markdown-body :deep(.hljs-function .hljs-title),
.markdown-body :deep(.hljs-section) {
  color: #60a5fa;
}

.markdown-body :deep(.hljs-variable),
.markdown-body :deep(.hljs-template-variable),
.markdown-body :deep(.hljs-attr),
.markdown-body :deep(.hljs-property) {
  color: #f8c555;
}

.markdown-body :deep(.hljs-string),
.markdown-body :deep(.hljs-regexp),
.markdown-body :deep(.hljs-bullet) {
  color: #86efac;
}

.markdown-body :deep(.hljs-number),
.markdown-body :deep(.hljs-literal),
.markdown-body :deep(.hljs-symbol) {
  color: #fb7185;
}

.markdown-body :deep(.hljs-built_in),
.markdown-body :deep(.hljs-class .hljs-title),
.markdown-body :deep(.hljs-params) {
  color: #22d3ee;
}

.markdown-body :deep(.hljs-meta),
.markdown-body :deep(.hljs-meta .hljs-keyword) {
  color: #c084fc;
}

.markdown-body :deep(img) {
  display: inline-block;
  max-width: 100%;
  height: auto;
  margin: 0;
  border-radius: 1rem;
}

.markdown-body :deep(p > img:only-child) {
  display: block;
  margin: 1.4rem 0;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 1.2rem 0;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid var(--border-default);
  background: var(--bg-soft);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 0.8rem 0.95rem;
  border-bottom: 1px solid var(--border-default);
  text-align: left;
  vertical-align: top;
}

.markdown-body :deep(th) {
  color: var(--text-primary);
  background: var(--chip-glaze);
  font-weight: 700;
}

.markdown-body :deep(td) {
  color: var(--text-secondary);
}

.markdown-body :deep(tr:last-child td) {
  border-bottom: 0;
}

.markdown-body :deep(blockquote) {
  padding: 0.2rem 0 0.2rem 1rem;
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
}

.markdown-body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--border-default);
  margin: 2rem 0;
}

@media (max-width: 920px) {
  .markdown-body {
    max-width: 100%;
  }
}

@media (max-width: 720px) {
  .markdown-body {
    line-height: 1.8;
  }

  .markdown-body :deep(pre) {
    padding: 2.8rem 0.9rem 0.9rem;
    border-radius: 0.9rem;
  }

  .markdown-body :deep(pre::before) {
    top: 0.7rem;
    right: 0.8rem;
    font-size: 0.68rem;
  }
}

@media (max-width: 560px) {
  .markdown-body :deep(p),
  .markdown-body :deep(ul),
  .markdown-body :deep(ol),
  .markdown-body :deep(blockquote),
  .markdown-body :deep(pre) {
    margin: 0.85rem 0;
  }

  .markdown-body :deep(ul),
  .markdown-body :deep(ol) {
    padding-left: 1.15rem;
  }

  .markdown-body :deep(code) {
    font-size: 0.88em;
  }

  .markdown-body :deep(pre code) {
    font-size: 0.84rem;
    line-height: 1.65;
  }

  .markdown-body :deep(blockquote) {
    padding-left: 0.8rem;
  }
}
</style>
