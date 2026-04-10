<template>
  <section class="section">
    <div class="section-header">
      <div>
        <p class="section-link">{{ t('home.featuredProjects.eyebrow') }}</p>
        <h2>{{ t('home.featuredProjects.title') }}</h2>
      </div>
      <RouterLink class="section-link" to="/projects">{{ t('home.featuredProjects.action') }}</RouterLink>
    </div>

    <div class="project-showcase">
      <RouterLink
        v-if="featuredProject"
        class="project-card project-card-featured"
        :to="{ name: 'project-detail', params: { slug: featuredProject.slug } }"
      >
        <div class="project-card-top">
          <p class="project-label">Project</p>
          <span class="project-doc-count">{{ featuredProject.docs.length }} docs</span>
        </div>
        <h3>{{ getProjectName(featuredProject) }}</h3>
        <p class="project-desc">{{ getProjectDescription(featuredProject) }}</p>
        <div class="stack-list">
          <span class="stack" v-for="stack in featuredProject.stacks" :key="stack">{{ stack }}</span>
        </div>
      </RouterLink>

      <div class="project-rail">
        <RouterLink
          class="project-card project-card-compact"
          v-for="project in secondaryProjects"
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
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { projects as projectList } from '@/data/projects'

const { t } = useLocale()
const featuredProject = computed(() => projectList[0] ?? null)
const secondaryProjects = computed(() => projectList.slice(1, 4))

const getProjectName = (project) => project.name ?? t(project.nameKey)
const getProjectDescription = (project) => project.description ?? t(project.descriptionKey)
</script>

<style scoped>
.section {
  padding: 32px;
  background: var(--bg-surface);
  background-image: var(--section-shell-glaze);
  border: 1px solid var(--border-default);
  border-radius: 30px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  align-items: end;
  flex-wrap: wrap;
}

.section-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  color: var(--accent);
  background: var(--hero-pill-bg);
  border: 1px solid var(--chip-border);
}

.section-header h2 {
  margin: 0;
  font-size: clamp(32px, 3vw, 44px);
}

.project-showcase {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 16px;
}

.project-rail {
  display: grid;
  gap: 16px;
}

.project-card {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--border-default);
  border-radius: 24px;
  background: var(--bg-soft);
  background-image: var(--section-inner-glaze);
  overflow: hidden;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
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

.project-card-featured {
  align-content: end;
  padding: 28px;
}

.project-card-featured h3 {
  margin: 0;
  font-size: clamp(32px, 3.2vw, 46px);
  line-height: 1.04;
  max-width: 11ch;
}

.project-card-compact h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
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

.project-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.8;
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

@media (max-width: 900px) {
  .project-showcase {
    grid-template-columns: 1fr;
  }
}
</style>
