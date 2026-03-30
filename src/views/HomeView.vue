<template>
  <section class="home-page">
    <HeroSection />
    <LastestPosts/>
    <FeaturedProjects/>
    <TechStack/>
  </section>
</template>

<script setup>
import FeaturedProjects from '@/components/home/FeaturedProjects.vue';
import HeroSection from '@/components/home/HeroSection.vue'
import LastestPosts from '@/components/home/LastestPosts.vue';
import TechStack from '@/components/home/TechStack.vue';
</script>

<style scoped>
.home-page {
  display: grid;
  gap: 32px;
}
</style>
