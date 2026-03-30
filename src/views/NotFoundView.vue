<template>
  <section class="page">
    <h1>404</h1>
    <p class="lead">{{ t('notFound.lead') }}</p>
    <RouterLink class="back-link" to="/">{{ t('notFound.action') }}</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>
