<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">🗺️ Study Roadmap</h1>
      <p class="text-gray-600 text-lg">
        Visualize your learning journey organized by category
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Loading roadmap...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200 text-center py-8">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="documents.length === 0" class="card text-center py-12">
      <span class="text-6xl mb-4 block">🗺️</span>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
      <p class="text-gray-600">Your study roadmap will appear here once you add documents</p>
    </div>

    <!-- Roadmap Timeline -->
    <div v-else class="space-y-8">
      <!-- Category Sections -->
      <div 
        v-for="category in categoriesWithDocuments"
        :key="category.id"
        class="card"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🏷️</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ category.metadata.category_name }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ getCategoryDocuments(category.id).length }} document{{ getCategoryDocuments(category.id).length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
          
          <router-link 
            :to="`/categories/${category.slug}`"
            class="text-primary hover:text-primary-dark font-medium text-sm"
          >
            View all →
          </router-link>
        </div>

        <!-- Timeline for this category -->
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div class="space-y-6">
            <div 
              v-for="(document, index) in getCategoryDocuments(category.id)"
              :key="document.id"
              class="relative pl-16"
            >
              <!-- Timeline node -->
              <div class="absolute left-0 top-3 w-12 h-12 bg-white border-4 border-primary rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-primary">{{ index + 1 }}</span>
              </div>

              <!-- Document card -->
              <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <router-link 
                      :to="`/documents/${document.slug}`"
                      class="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
                    >
                      {{ document.metadata.document_title }}
                    </router-link>
                    
                    <div class="flex items-center gap-3 mt-2">
                      <span 
                        v-if="document.metadata.processing_status"
                        :class="getStatusClass(document.metadata.processing_status.value)"
                        class="px-2.5 py-1 text-xs font-medium rounded-full"
                      >
                        {{ document.metadata.processing_status.value }}
                      </span>
                      
                      <span 
                        v-if="document.metadata.document_type"
                        class="text-sm text-gray-600"
                      >
                        {{ document.metadata.document_type.value }}
                      </span>

                      <span 
                        v-if="document.metadata.upload_date"
                        class="text-sm text-gray-500"
                      >
                        {{ formatDate(document.metadata.upload_date) }}
                      </span>
                    </div>
                  </div>

                  <img 
                    v-if="document.metadata.original_file"
                    :src="`${document.metadata.original_file.imgix_url}?w=160&h=120&fit=crop&auto=format,compress`"
                    :alt="document.metadata.document_title"
                    class="w-20 h-20 rounded-lg object-cover ml-4"
                  />
                </div>

                <p 
                  v-if="document.metadata.ai_summary"
                  class="text-gray-600 text-sm line-clamp-2"
                >
                  {{ extractTextFromHtml(document.metadata.ai_summary) }}
                </p>

                <div 
                  v-if="document.metadata.tags"
                  class="flex flex-wrap gap-2 mt-3"
                >
                  <span 
                    v-for="tag in getTags(document.metadata.tags)"
                    :key="tag"
                    class="px-2 py-1 text-xs text-gray-600 bg-white rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Uncategorized Documents -->
      <div v-if="uncategorizedDocuments.length > 0" class="card">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📂</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Uncategorized</h2>
              <p class="text-sm text-gray-600">
                {{ uncategorizedDocuments.length }} document{{ uncategorizedDocuments.length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link 
            v-for="document in uncategorizedDocuments"
            :key="document.id"
            :to="`/documents/${document.slug}`"
            class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <h3 class="font-semibold text-gray-900 mb-2">
              {{ document.metadata.document_title }}
            </h3>
            <div class="flex items-center gap-2">
              <span 
                v-if="document.metadata.processing_status"
                :class="getStatusClass(document.metadata.processing_status.value)"
                class="px-2 py-0.5 text-xs font-medium rounded-full"
              >
                {{ document.metadata.processing_status.value }}
              </span>
              <span 
                v-if="document.metadata.document_type"
                class="text-xs text-gray-600"
              >
                {{ document.metadata.document_type.value }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDocuments, getCategories } from '../lib/cosmic'
import type { Document, Category } from '../types'

const documents = ref<Document[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const categoriesWithDocuments = computed(() => {
  return categories.value.filter(category => 
    documents.value.some(doc => doc.metadata.category?.id === category.id)
  )
})

const uncategorizedDocuments = computed(() => {
  return documents.value.filter(doc => !doc.metadata.category)
})

const getCategoryDocuments = (categoryId: string) => {
  const docs = documents.value.filter(doc => 
    doc.metadata.category?.id === categoryId
  )
  
  // Sort by upload date (newest first)
  return docs.sort((a, b) => {
    const dateA = new Date(a.metadata.upload_date || '').getTime()
    const dateB = new Date(b.metadata.upload_date || '').getTime()
    return dateB - dateA
  })
}

const getStatusClass = (status: string) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getTags = (tagsString: string) => {
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
}

const extractTextFromHtml = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

onMounted(async () => {
  try {
    loading.value = true
    const [docsData, catsData] = await Promise.all([
      getDocuments(),
      getCategories()
    ])
    documents.value = docsData as Document[]
    categories.value = catsData as Category[]
  } catch (e) {
    error.value = 'Failed to load roadmap data. Please try again.'
    console.error('Error loading roadmap:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>