<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Loading document...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200 text-center py-8">
      <p class="text-red-800">{{ error }}</p>
      <router-link to="/documents" class="inline-block mt-4 text-primary hover:text-primary-dark">
        ← Back to Documents
      </router-link>
    </div>

    <!-- Document Content -->
    <div v-else-if="document">
      <!-- Back Button -->
      <router-link 
        to="/documents"
        class="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Documents
      </router-link>

      <!-- Document Header -->
      <div class="card mb-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-3">
              {{ document.metadata.document_title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-3">
              <span 
                v-if="document.metadata.processing_status"
                :class="getStatusClass(document.metadata.processing_status.value)"
                class="px-3 py-1.5 text-sm font-medium rounded-full"
              >
                {{ document.metadata.processing_status.value }}
              </span>
              
              <span 
                v-if="document.metadata.document_type"
                class="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {{ document.metadata.document_type.value }}
              </span>

              <span 
                v-if="document.metadata.category"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary bg-blue-50 rounded-full"
              >
                🏷️ {{ document.metadata.category.metadata.category_name }}
              </span>

              <span 
                v-if="document.metadata.upload_date"
                class="text-sm text-gray-500"
              >
                Uploaded {{ formatDate(document.metadata.upload_date) }}
              </span>
            </div>
          </div>

          <img 
            v-if="document.metadata.original_file"
            :src="`${document.metadata.original_file.imgix_url}?w=320&h=240&fit=crop&auto=format,compress`"
            :alt="document.metadata.document_title"
            class="w-40 h-32 rounded-lg object-cover ml-6 hidden md:block"
          />
        </div>

        <div 
          v-if="document.metadata.tags"
          class="flex flex-wrap gap-2 pt-4 border-t border-gray-200"
        >
          <span 
            v-for="tag in getTags(document.metadata.tags)"
            :key="tag"
            class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- AI Summary -->
      <div v-if="document.metadata.ai_summary" class="card mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span class="mr-2">🤖</span>
          AI Summary
        </h2>
        <div 
          class="prose prose-lg max-w-none"
          v-html="document.metadata.ai_summary"
        />
      </div>

      <!-- Key Insights -->
      <div v-if="document.metadata.key_insights" class="card mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span class="mr-2">💡</span>
          Key Insights
        </h2>
        <div 
          class="prose prose-lg max-w-none markdown-content"
          v-html="renderMarkdown(document.metadata.key_insights)"
        />
      </div>

      <!-- Original File -->
      <div v-if="document.metadata.original_file" class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span class="mr-2">📎</span>
          Original File
        </h2>
        <a 
          :href="document.metadata.original_file.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Original File
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDocument } from '../lib/cosmic'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { Document } from '../types'

const route = useRoute()
const document = ref<Document | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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
    month: 'long', 
    day: 'numeric' 
  })
}

const getTags = (tagsString: string) => {
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
}

const renderMarkdown = (markdown: string) => {
  const html = marked(markdown)
  return DOMPurify.sanitize(html)
}

onMounted(async () => {
  try {
    loading.value = true
    const slug = route.params.slug as string
    const data = await getDocument(slug)
    
    if (!data) {
      error.value = 'Document not found'
      return
    }
    
    document.value = data as Document
  } catch (e) {
    error.value = 'Failed to load document. Please try again.'
    console.error('Error loading document:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  color: #111827;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(strong) {
  color: #111827;
  font-weight: 600;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.markdown-content :deep(h1) {
  font-size: 1.875rem;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
}
</style>