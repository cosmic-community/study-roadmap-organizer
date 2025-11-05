<template>
  <router-link 
    :to="`/categories/${category.slug}`"
    class="card hover:shadow-md transition-shadow duration-200 block"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xl font-semibold text-gray-900">
        {{ category.metadata.category_name }}
      </h3>
      <span class="text-2xl">🏷️</span>
    </div>
    
    <p 
      v-if="category.metadata.description"
      class="text-gray-600 text-sm mb-4"
    >
      {{ category.metadata.description }}
    </p>
    
    <div class="flex items-center justify-between pt-3 border-t border-gray-200">
      <span class="text-sm text-gray-500">
        {{ documentCount }} document{{ documentCount !== 1 ? 's' : '' }}
      </span>
      <span class="text-primary text-sm font-medium">
        View →
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Category } from '../types'

interface Props {
  category: Category
  documentCount?: number
}

withDefaults(defineProps<Props>(), {
  documentCount: 0
})
</script>