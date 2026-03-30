<template>
  <section class="section">
    <div class="section-header">
      <div>
        <p class="section-link">{{ t('home.featuredProjects.eyebrow') }}</p>
        <h2>{{ t('home.featuredProjects.title') }}</h2>
      </div>
      <RouterLink class="section-link" to="/projects">{{ t('home.featuredProjects.action') }}</RouterLink>
    </div>

    <div class="project-grid">
      <RouterLink
        class="project-card"
        v-for="project in projectList"
        :key="project.slug"
        :to="{ name: 'project-detail', params: { slug: project.slug } }"
      >
        <div class="project-card-top">
          <p class="project-label">Project</p>
          <span class="project-doc-count">{{ project.docs.length }} docs</span>
        </div>
        <h3>{{ getProjectName(project) }}</h3>
        <p class="project-desc">{{ getProjectDescription(project) }}</p>
        <div class="stack-list">
          <span class="stack" v-for="stack in project.stacks" :key="stack">{{ stack }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { projects as projectList } from '@/data/projects'

const { t } = useLocale()

const getProjectName = (project) => project.name ?? t(project.nameKey)
const getProjectDescription = (project) => project.description ?? t(project.descriptionKey)
</script>

<style scoped>
.section {
  padding: 28px;
  background: var(--bg-surface);
  background-image: var(--section-shell-glaze);
  border: 1px solid var(--border-default);
  border-radius: 28px;
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.section-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 600;
  color: var(--accent);
  background: var(--hero-pill-bg);
  border: 1px solid var(--chip-border);
}

.section-header h2 {
  margin: 0;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.project-card {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--border-default);
  border-radius: 20px;
  background: var(--bg-soft);
  background-image: var(--section-inner-glaze);
  overflow: hidden;
}

.project-card::after {
  content: '';
  position: absolute;
  right: -2.5rem;
  bottom: -2.5rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: radial-gradient(circle, var(--hero-button-glow) 0%, transparent 72%);
  opacity: 0.65;
  pointer-events: none;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--interactive-shadow);
}

.project-card-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.project-label {
  margin: 0;
  color: var(--text-muted);
  letter-spacing: 0.08em;
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

.project-card h3 {
  margin: 0;
  color: var(--text-primary);
}

.project-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.stack-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stack {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chip-glaze);
  color: var(--accent);
  border: 1px solid var(--chip-border);
  font-size: 13px;
}
</style>
