<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">🏷️ Categories</h1>
      <p class="text-gray-600 text-lg">
        Organize your documents by category
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Loading categories...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200 text-center py-8">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="card text-center py-12">
      <span class="text-6xl mb-4 block">🏷️</span>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
      <p class="text-gray-600">Categories help organize your study materials</p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard 
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :document-count="getCategoryDocumentCount(category.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories, getDocuments } from '../lib/cosmic'
import CategoryCard from '../components/CategoryCard.vue'
import type { Category, Document } from '../types'

const categories = ref<Category[]>([])
const documents = ref<Document[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const getCategoryDocumentCount = (categoryId: string) => {
  return documents.value.filter(doc => 
    doc.metadata.category?.id === categoryId
  ).length
}

onMounted(async () => {
  try {
    loading.value = true
    const [catsData, docsData] = await Promise.all([
      getCategories(),
      getDocuments()
    ])
    categories.value = catsData as Category[]
    documents.value = docsData as Document[]
  } catch (e) {
    error.value = 'Failed to load categories. Please try again.'
    console.error('Error loading categories:', e)
  } finally {
    loading.value = false
  }
})
</script>