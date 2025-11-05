<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <CosmicBadge :bucketSlug="bucketSlug" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from './components/Header.vue'
import CosmicBadge from './components/CosmicBadge.vue'

const bucketSlug = computed(() => import.meta.env.VITE_COSMIC_BUCKET_SLUG || 'study-work-space-production')
</script>