<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">📄 All Documents</h1>
      <p class="text-gray-600 text-lg">
        Browse and manage your study materials
      </p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search documents..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select 
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.metadata.category_name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select 
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-600">Loading documents...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 border-red-200 text-center py-8">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredDocuments.length === 0" class="card text-center py-12">
      <span class="text-6xl mb-4 block">📄</span>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ documents.length === 0 ? 'No documents yet' : 'No matching documents' }}
      </h3>
      <p class="text-gray-600">
        {{ documents.length === 0 ? 'Start by adding your first study document' : 'Try adjusting your filters' }}
      </p>
    </div>

    <!-- Documents Grid -->
    <div v-else>
      <div class="mb-4 text-sm text-gray-600">
        Showing {{ filteredDocuments.length }} of {{ documents.length }} documents
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentCard 
          v-for="document in filteredDocuments"
          :key="document.id"
          :document="document"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDocuments, getCategories } from '../lib/cosmic'
import DocumentCard from '../components/DocumentCard.vue'
import type { Document, Category } from '../types'

const documents = ref<Document[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const filteredDocuments = computed(() => {
  let filtered = documents.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.metadata.document_title.toLowerCase().includes(query) ||
      doc.metadata.tags?.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(doc => 
      doc.metadata.category?.id === selectedCategory.value
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(doc => 
      doc.metadata.processing_status?.value === selectedStatus.value
    )
  }

  return filtered
})

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
    error.value = 'Failed to load documents. Please try again.'
    console.error('Error loading documents:', e)
  } finally {
    loading.value = false
  }
})
</script>