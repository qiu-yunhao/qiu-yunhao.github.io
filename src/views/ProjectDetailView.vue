<template>
  <section v-if="project" class="project-detail-page">
    <RouterLink class="back-link" to="/projects">← 返回项目列表</RouterLink>

    <header class="project-hero">
      <div class="project-hero-main">
        <p class="project-kicker">PROJECT</p>
        <h1>{{ projectName }}</h1>
        <p class="project-summary">{{ projectDescription }}</p>
      </div>

      <div class="project-actions">
        <a class="project-action primary" :href="project.githubUrl" target="_blank" rel="noreferrer">
          打开 GitHub
        </a>
        <a
          v-if="project.readmeUrl"
          class="project-action"
          :href="project.readmeUrl"
          target="_blank"
          rel="noreferrer"
        >
          查看 README 原文
        </a>
      </div>

      <div class="project-stack-list">
        <span class="project-stack" v-for="stack in project.stacks" :key="stack">{{ stack }}</span>
      </div>
    </header>

    <div class="project-detail-layout">
      <aside class="project-docs-panel">
        <p class="panel-title">项目文档</p>
        <RouterLink
          v-for="doc in project.docs"
          :key="doc.slug"
          class="doc-link"
          :class="{ active: activeDoc?.slug === doc.slug }"
          :to="{ name: 'project-detail', params: { slug: project.slug, docSlug: doc.slug } }"
        >
          <span class="doc-link-label">{{ doc.label }}</span>
          <span class="doc-link-desc">{{ doc.description }}</span>
        </RouterLink>
      </aside>

      <section class="project-doc-card card">
        <div class="doc-head">
          <div>
            <p class="doc-source">{{ activeDocSourceLabel }}</p>
            <h2>{{ activeDoc?.label }}</h2>
          </div>
        </div>

        <p v-if="docError" class="doc-feedback error">{{ docError }}</p>
        <p v-else-if="isLoadingDoc" class="doc-feedback">正在加载 GitHub 文档...</p>
        <MarkdownRenderer v-else-if="activeContent" :content="activeContent" :base-url="activeDocBaseUrl" />
        <p v-else class="doc-feedback">这个文档暂时还没有内容。</p>
      </section>

      <aside class="project-toc-panel" v-if="docHeadings.length">
        <p class="panel-title">章节目录</p>
        <a
          v-for="heading in docHeadings"
          :key="heading.id"
          class="toc-link"
          :class="`level-${heading.level}`"
          :href="`#${heading.id}`"
        >
          {{ heading.text }}
        </a>
      </aside>
    </div>
  </section>

  <section v-else class="page">
    <h1>项目不存在</h1>
    <p class="lead">当前项目链接没有找到，你可以先回到项目列表查看其他内容。</p>
    <RouterLink class="back-link" to="/projects">返回项目列表</RouterLink>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/post/MarkdownRenderer.vue'
import { useLocale } from '@/composables/useLocale'
import { getProjectBySlug, getProjectDoc } from '@/data/projects'
import { parseMarkdown } from '@/utils/markdown'

const route = useRoute()
const { t } = useLocale()

const project = computed(() => getProjectBySlug(route.params.slug))
const projectName = computed(() => {
  if (!project.value) {
    return ''
  }

  return project.value.name ?? (project.value.nameKey ? t(project.value.nameKey) : '')
})
const projectDescription = computed(() => {
  if (!project.value) {
    return ''
  }

  return project.value.description ?? (project.value.descriptionKey ? t(project.value.descriptionKey) : '')
})
const activeDoc = computed(() => getProjectDoc(project.value, route.params.docSlug))

const activeContent = ref('')
const isLoadingDoc = ref(false)
const docError = ref('')

const activeDocSourceLabel = computed(() => {
  if (!activeDoc.value) {
    return ''
  }

  return activeDoc.value.source === 'remote' ? 'GitHub Markdown' : 'Local Markdown'
})

const activeDocBaseUrl = computed(() => {
  if (!activeDoc.value?.url) {
    return ''
  }

  try {
    return new URL('.', activeDoc.value.url).toString()
  } catch {
    return ''
  }
})

const docHeadings = computed(() => {
  if (!activeContent.value) {
    return []
  }

  return parseMarkdown(activeContent.value, { baseUrl: activeDocBaseUrl.value }).headings
})

watch(
  activeDoc,
  async (doc) => {
    activeContent.value = ''
    docError.value = ''
    isLoadingDoc.value = false

    if (!doc) {
      return
    }

    if (doc.source === 'local') {
      activeContent.value = doc.content ?? ''
      return
    }

    if (!doc.url) {
      docError.value = '这个文档还没有配置远程地址。'
      return
    }

    isLoadingDoc.value = true

    try {
      const response = await fetch(doc.url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      activeContent.value = await response.text()
    } catch (error) {
      docError.value = 'GitHub 文档加载失败。请检查仓库地址、raw 链接或网络访问权限。'
    } finally {
      isLoadingDoc.value = false
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.project-detail-page {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}

.project-hero {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
  padding: 30px;
  border-radius: 28px;
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.project-kicker {
  margin: 0 0 10px;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  font-size: 12px;
  font-weight: 700;
}

.project-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 3.6vw, 3.4rem);
  line-height: 1.05;
}

.project-summary {
  margin: 14px 0 0;
  max-width: 76ch;
  color: var(--text-secondary);
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.project-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--chip-border);
  background: var(--bg-soft);
  color: var(--text-primary);
}

.project-action.primary {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}

.project-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.project-stack {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}

.project-detail-layout {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr) minmax(220px, 260px);
  gap: 24px;
  align-items: start;
  width: 100%;
  min-width: 0;
}

.project-docs-panel {
  position: sticky;
  top: 96px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 20px;
  border-radius: 24px;
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.project-toc-panel {
  position: sticky;
  top: 96px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 20px;
  border-radius: 24px;
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}

.panel-title {
  margin: 0 0 14px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.doc-link {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid transparent;
  color: var(--text-secondary);
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
  min-width: 0;
}

.doc-link + .doc-link {
  margin-top: 10px;
}

.doc-link:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  background: var(--bg-soft);
}

.doc-link.active {
  border-color: var(--accent);
  background: var(--hero-pill-bg);
}

.doc-link-label {
  color: var(--text-primary);
  font-weight: 600;
}

.doc-link-desc {
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.toc-link {
  display: block;
  padding: 8px 0;
  color: var(--text-secondary);
  transition: color 0.2s ease;
  overflow-wrap: anywhere;
}

.toc-link:hover {
  color: var(--accent);
}

.toc-link.level-2,
.toc-link.level-3,
.toc-link.level-4,
.toc-link.level-5,
.toc-link.level-6 {
  padding-left: 14px;
}

.project-doc-card {
  display: block;
  box-sizing: border-box;
  inline-size: 100%;
  width: 100%;
  min-width: 0;
  min-inline-size: 0;
  justify-self: stretch;
  align-self: start;
  padding: 28px;
  border-radius: 28px;
  overflow: hidden;
}

.doc-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  min-width: 0;
  flex-wrap: wrap;
}

.doc-head > div {
  min-width: 0;
}

.doc-head h2 {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
}

.doc-source {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.doc-feedback {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.doc-feedback.error {
  color: #b42318;
}

.project-doc-card :deep(.markdown-body) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.project-doc-card :deep(.markdown-body > *) {
  max-width: 100%;
}

.project-doc-card :deep(p),
.project-doc-card :deep(li),
.project-doc-card :deep(blockquote),
.project-doc-card :deep(h1),
.project-doc-card :deep(h2),
.project-doc-card :deep(h3),
.project-doc-card :deep(h4) {
  overflow-wrap: anywhere;
}

.project-doc-card :deep(pre),
.project-doc-card :deep(img) {
  max-width: 100%;
}

@media (min-width: 1680px) {
  .project-detail-layout {
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr) minmax(240px, 300px);
  }
}

@media (max-width: 1380px) {
  .project-detail-layout {
    grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  }

  .project-toc-panel {
    grid-column: 1 / -1;
    position: static;
    top: auto;
    max-height: none;
  }
}

@media (max-width: 1180px) {
  .project-detail-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-docs-panel {
    position: static;
    top: auto;
    max-height: none;
    order: -1;
  }

  .project-toc-panel {
    position: static;
    top: auto;
    max-height: none;
    order: 0;
  }
}

@media (max-width: 960px) {
  .project-detail-layout {
    grid-template-columns: 1fr;
  }

  .project-docs-panel {
    order: 0;
  }
}

@media (max-width: 720px) {
  .project-detail-page {
    gap: 18px;
  }

  .project-hero h1 {
    font-size: clamp(1.9rem, 8vw, 2.7rem);
  }

  .project-summary {
    font-size: 0.98rem;
    line-height: 1.7;
  }

  .project-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .project-action {
    width: 100%;
  }

  .project-hero,
  .project-doc-card,
  .project-docs-panel,
  .project-toc-panel {
    padding: 20px;
  }
}

@media (max-width: 560px) {
  .project-hero,
  .project-doc-card,
  .project-docs-panel,
  .project-toc-panel {
    padding: 16px;
    border-radius: 20px;
  }

  .project-stack-list {
    gap: 8px;
  }

  .project-stack {
    padding: 6px 10px;
    font-size: 12px;
  }

  .doc-link {
    padding: 12px 14px;
    border-radius: 16px;
  }

  .doc-link-desc {
    font-size: 13px;
  }

  .doc-head {
    margin-bottom: 16px;
  }

  .toc-link {
    padding: 6px 0;
    font-size: 0.95rem;
  }
}
</style>
