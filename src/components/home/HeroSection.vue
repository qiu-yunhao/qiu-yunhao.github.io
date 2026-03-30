<template>
  <section class="hero">
    <div class="hero-copy">
      <div class="hero-scenery" aria-hidden="true">
        <span class="hero-scene-disc"></span>
        <span class="hero-scene-band"></span>
        <span class="hero-scene-mark"></span>
      </div>

      <p class="eyebrow">{{ t('home.hero.eyebrow') }}</p>
      <h1>{{ t('home.hero.title') }}</h1>
      <p class="hero-text">{{ t('home.hero.description') }}</p>

      <div class="hero-actions">
        <RouterLink class="primary-btn" to="/posts">{{ t('home.hero.primaryAction') }}</RouterLink>
        <RouterLink class="secondary-btn" to="/projects">{{ t('home.hero.secondaryAction') }}</RouterLink>
      </div>
    </div>

    <div class="hero-card">
      <p class="hero-card-label">{{ t('home.focusCard.label') }}</p>
      <h2>{{ t('home.focusCard.title') }}</h2>
      <ul>
        <li v-for="item in focusItems" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
const focusItems = computed(() => t('home.focusCard.items'))
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  align-items: stretch;
  position: relative;
}

.hero-copy,
.hero-card {
  position: relative;
  overflow: hidden;
  padding: 32px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.hero-copy {
  background-image: var(--hero-copy-glaze);
}

.hero-card {
  background-image: var(--hero-card-glaze);
}

.hero-copy::before,
.hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: var(--hero-frame-pattern);
  opacity: 0.8;
}

.hero-copy::after {
  content: '';
  position: absolute;
  inset: auto 1.4rem 1.1rem auto;
  width: 7rem;
  height: 7rem;
  border-radius: 1.4rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 58%),
    radial-gradient(circle, var(--hero-button-glow) 0%, transparent 70%);
  opacity: 0.58;
  filter: blur(2px);
  pointer-events: none;
}

.hero-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0 auto;
  width: 8.5rem;
  height: 8rem;
  clip-path: var(--hero-card-deco-clip);
  background: var(--hero-card-deco-bg);
  opacity: 0.7;
  pointer-events: none;
}

.hero-scenery {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-scene-disc,
.hero-scene-band,
.hero-scene-mark {
  position: absolute;
  display: block;
}

.hero-scene-disc {
  width: var(--hero-scene-disc-width);
  height: var(--hero-scene-disc-height);
  top: var(--hero-scene-disc-top, auto);
  right: var(--hero-scene-disc-right, auto);
  bottom: var(--hero-scene-disc-bottom, auto);
  left: var(--hero-scene-disc-left, auto);
  border-radius: var(--hero-scene-disc-radius);
  clip-path: var(--hero-scene-disc-clip);
  background: var(--hero-scene-disc-bg);
  transform: var(--hero-scene-disc-transform);
  opacity: var(--hero-scene-disc-opacity);
}

.hero-scene-band {
  width: var(--hero-scene-band-width);
  height: var(--hero-scene-band-height);
  top: var(--hero-scene-band-top, auto);
  right: var(--hero-scene-band-right, auto);
  bottom: var(--hero-scene-band-bottom, auto);
  left: var(--hero-scene-band-left, auto);
  border-radius: var(--hero-scene-band-radius);
  clip-path: var(--hero-scene-band-clip);
  background: var(--hero-scene-band-bg);
  transform: var(--hero-scene-band-transform);
  opacity: var(--hero-scene-band-opacity);
}

.hero-scene-mark {
  width: var(--hero-scene-mark-width);
  height: var(--hero-scene-mark-height);
  top: var(--hero-scene-mark-top, auto);
  right: var(--hero-scene-mark-right, auto);
  bottom: var(--hero-scene-mark-bottom, auto);
  left: var(--hero-scene-mark-left, auto);
  border-radius: var(--hero-scene-mark-radius);
  clip-path: var(--hero-scene-mark-clip);
  background: var(--hero-scene-mark-bg);
  transform: var(--hero-scene-mark-transform);
  opacity: var(--hero-scene-mark-opacity);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 12px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--accent);
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid rgba(255, 255, 255, 0.36);
  position: relative;
  z-index: 1;
}

h1 {
  margin: 0 0 16px;
  font-size: 46px;
  line-height: 1.15;
  max-width: 11ch;
  position: relative;
  z-index: 1;
  background-image: var(--hero-title-fill);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-text {
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 56ch;
  position: relative;
  z-index: 1;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.primary-btn {
  background: var(--accent);
  color: var(--accent-contrast);
  box-shadow: 0 14px 30px var(--hero-button-glow);
}

.secondary-btn {
  border: 1px solid var(--border-default);
  background: var(--bg-soft);
  color: var(--text-primary);
}

.primary-btn:hover,
.secondary-btn:hover {
  transform: translateY(-2px);
}

.secondary-btn:hover {
  border-color: var(--border-strong);
}

.hero-card-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 8px;
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  background: var(--hero-pill-bg);
  border: 1px solid rgba(255, 255, 255, 0.36);
  position: relative;
  z-index: 1;
}

.hero-card h2 {
  margin: 0 0 12px;
  position: relative;
  z-index: 1;
}

.hero-card ul {
  margin: 0;
  padding-left: 0;
  list-style: none;
  color: var(--text-secondary);
  line-height: 1.8;
  display: grid;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.hero-card li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.hero-card li::before {
  content: '';
  width: 10px;
  height: 10px;
  margin-top: 0.5em;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 16%, transparent);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 34px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .hero-copy::after {
    width: 5rem;
    height: 5rem;
    right: 1rem;
    bottom: 1rem;
  }

  .hero-scene-disc {
    transform: scale(0.84) var(--hero-scene-disc-transform);
    transform-origin: center;
  }
}
</style>
