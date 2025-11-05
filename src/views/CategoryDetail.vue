<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Loading category...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200 text-center py-8">
      <p class="text-red-800">{{ error }}</p>
      <router-link to="/categories" class="inline-block mt-4 text-primary hover:text-primary-dark">
        ← Back to Categories
      </router-link>
    </div>

    <!-- Category Content -->
    <div v-else-if="category">
      <!-- Back Button -->
      <router-link 
        to="/categories"
        class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Categories
      </router-link>

      <!-- Category Header -->
      <div class="card mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span class="mr-3">🏷️</span>
              {{ category.metadata.category_name }}
            </h1>
            <p class="text-gray-600 text-lg">
              {{ categoryDocuments.length }} document{{ categoryDocuments.length !== 1 ? 's' : '' }} in this category
            </p>
          </div>
        </div>
        
        <p 
          v-if="category.metadata.description"
          class="text-gray-700 mt-4 pt-4 border-t border-gray-200"
        >
          {{ category.metadata.description }}
        </p>
      </div>

      <!-- Documents in Category -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Documents</h2>

        <div v-if="categoryDocuments.length === 0" class="card text-center py-12">
          <span class="text-6xl mb-4 block">📄</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No documents in this category</h3>
          <p class="text-gray-600">Documents will appear here once added to this category</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentCard 
            v-for="document in categoryDocuments"
            :key="document.id"
            :document="document"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategories, getDocuments } from '../lib/cosmic'
import DocumentCard from '../components/DocumentCard.vue'
import type { Category, Document } from '../types'

const route = useRoute()
const category = ref<Category | null>(null)
const documents = ref<Document[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const categoryDocuments = computed(() => {
  if (!category.value) return []
  
  return documents.value.filter(doc => 
    doc.metadata.category?.id === category.value!.id
  )
})

onMounted(async () => {
  try {
    loading.value = true
    const slug = route.params.slug as string
    
    const [catsData, docsData] = await Promise.all([
      getCategories(),
      getDocuments()
    ])
    
    const allCategories = catsData as Category[]
    const foundCategory = allCategories.find(cat => cat.slug === slug)
    
    if (!foundCategory) {
      error.value = 'Category not found'
      return
    }
    
    category.value = foundCategory
    documents.value = docsData as Document[]
  } catch (e) {
    error.value = 'Failed to load category. Please try again.'
    console.error('Error loading category:', e)
  } finally {
    loading.value = false
  }
})
</script>