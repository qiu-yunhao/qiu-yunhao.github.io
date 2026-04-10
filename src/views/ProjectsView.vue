<template>
  <section class="page">
    <section class="page-hero">
      <div class="page-hero-main">
        <p class="page-kicker">PROJECT INDEX</p>
        <h1>{{ t('projectsPage.title') }}</h1>
        <p class="lead">{{ t('projectsPage.lead') }}</p>
      </div>

      <aside class="page-hero-side">
        <h2>{{ t('projectsPage.summaryTitle') }}</h2>
        <p>{{ t('projectsPage.summaryLead') }}</p>
        <ul class="page-hero-list">
          <li>{{ summaryLines.total }}</li>
          <li>{{ summaryLines.docs }}</li>
          <li>{{ summaryLines.stack }}</li>
        </ul>
      </aside>
    </section>

    <div class="projects-grid">
      <RouterLink
        v-for="project in projectList"
        :key="project.slug"
        class="project-card"
        :to="{ name: 'project-detail', params: { slug: project.slug } }"
      >
        <div class="project-card-top">
          <p class="project-card-kicker">Project</p>
          <span class="project-doc-count">{{ project.docs.length }} docs</span>
        </div>

        <h2>{{ getProjectName(project) }}</h2>
        <p class="project-desc">{{ getProjectDescription(project) }}</p>

        <div class="stack-list">
          <span class="stack" v-for="stack in project.stacks" :key="stack">{{ stack }}</span>
        </div>

        <div class="project-doc-preview">
          <span class="doc-pill" v-for="doc in project.docs" :key="doc.slug">{{ doc.label }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { projects as projectList } from '@/data/projects'

const { t } = useLocale()

const docCount = computed(() => projectList.reduce((total, project) => total + project.docs.length, 0))
const stackCount = computed(() => new Set(projectList.flatMap((project) => project.stacks)).size)
const summaryLines = computed(() => ({
  total: t('projectsPage.summary.total', { count: projectList.length }),
  docs: t('projectsPage.summary.docs', { count: docCount.value }),
  stack: t('projectsPage.summary.stack', { count: stackCount.value }),
}))

const getProjectName = (project) => project.name ?? t(project.nameKey)
const getProjectDescription = (project) => project.description ?? t(project.descriptionKey)
</script>

<style scoped>
.page-hero-main {
  position: relative;
  overflow: hidden;
}

.page-hero-main::before {
  content: '';
  position: absolute;
  right: 1.6rem;
  bottom: 1.4rem;
  width: 10rem;
  height: 10rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.24), color-mix(in srgb, var(--accent) 14%, transparent));
  clip-path: polygon(50% 0, 100% 18%, 82% 100%, 22% 80%, 0 20%);
  opacity: 0.46;
  transform: rotate(10deg);
  pointer-events: none;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  position: relative;
  display: grid;
  gap: 16px;
  min-height: 280px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--border-default);
  background: var(--bg-surface);
  background-image: var(--theme-card-glaze);
  box-shadow: var(--shadow-md);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 auto;
  width: 9rem;
  height: 5rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.22), color-mix(in srgb, var(--accent-soft) 88%, transparent));
  clip-path: polygon(0 76%, 18% 58%, 32% 66%, 52% 42%, 70% 58%, 88% 46%, 100% 52%, 100% 100%, 0 100%);
  opacity: 0.5;
  pointer-events: none;
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.project-card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.project-card-kicker {
  margin: 0;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}

.project-doc-count {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 12px;
}

.project-card h2 {
  margin: 0;
  color: var(--text-primary);
}

.project-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
}

.stack-list,
.project-doc-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stack,
.doc-pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}

.stack {
  color: var(--accent);
}

.doc-pill {
  color: var(--text-secondary);
}

@media (min-width: 1440px) {
  .projects-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1920px) {
  .projects-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
