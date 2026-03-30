<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="container nav">
        <RouterLink class="logo" to="/">QYH Blog</RouterLink>

        <nav class="nav-links">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <RouterLink to="/posts">{{ t('nav.posts') }}</RouterLink>
          <RouterLink to="/projects">{{ t('nav.projects') }}</RouterLink>
          <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
        </nav>

        <div class="nav-controls">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>

    <main class="site-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2026 QYH. {{ t('footer.builtWith') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>
