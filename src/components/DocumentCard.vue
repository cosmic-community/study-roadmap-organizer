<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between mb-4">
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
        </div>
      </div>
      
      <img 
        v-if="document.metadata.original_file"
        :src="`${document.metadata.original_file.imgix_url}?w=160&h=120&fit=crop&auto=format,compress`"
        :alt="document.metadata.document_title"
        class="w-20 h-20 rounded-lg object-cover ml-4"
      />
    </div>
    
    <div 
      v-if="document.metadata.ai_summary"
      class="prose prose-sm max-w-none mb-4 text-gray-600 line-clamp-3"
      v-html="truncateSummary(document.metadata.ai_summary)"
    />
    
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center gap-2">
        <span 
          v-if="document.metadata.category"
          class="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-blue-50 rounded-full"
        >
          🏷️ {{ document.metadata.category.metadata.category_name }}
        </span>
      </div>
      
      <span 
        v-if="document.metadata.upload_date"
        class="text-sm text-gray-500"
      >
        {{ formatDate(document.metadata.upload_date) }}
      </span>
    </div>
    
    <div 
      v-if="document.metadata.tags"
      class="flex flex-wrap gap-2 mt-3"
    >
      <span 
        v-for="tag in getTags(document.metadata.tags)"
        :key="tag"
        class="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '../types'

interface Props {
  document: Document
}

defineProps<Props>()

const getStatusClass = (status: string) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const truncateSummary = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  const text = div.textContent || div.innerText || ''
  return text.length > 200 ? text.substring(0, 200) + '...' : text
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
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>