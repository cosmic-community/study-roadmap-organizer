<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">📚 Study Dashboard</h1>
      <p class="text-gray-600 text-lg">
        Organize, process, and access your study materials with AI-powered insights
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium mb-1">Total Documents</p>
            <p class="text-3xl font-bold text-gray-900">{{ documents.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📄</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium mb-1">Categories</p>
            <p class="text-3xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">🏷️</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium mb-1">Completed</p>
            <p class="text-3xl font-bold text-gray-900">{{ completedCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">✅</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link 
          to="/roadmap"
          class="card hover:shadow-md transition-shadow duration-200 flex items-center space-x-4"
        >
          <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
            <span class="text-2xl">🗺️</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">View Study Roadmap</h3>
            <p class="text-sm text-gray-600">Visualize your learning journey</p>
          </div>
        </router-link>

        <router-link 
          to="/documents"
          class="card hover:shadow-md transition-shadow duration-200 flex items-center space-x-4"
        >
          <div class="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📚</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">Browse Documents</h3>
            <p class="text-sm text-gray-600">Explore all your study materials</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Documents -->
    <div v-if="loading">
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading documents...</p>
      </div>
    </div>

    <div v-else-if="error">
      <div class="card bg-red-50 border-red-200 text-center py-8">
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Recent Documents</h2>
        <router-link 
          to="/documents"
          class="text-primary hover:text-primary-dark font-medium text-sm"
        >
          View all →
        </router-link>
      </div>

      <div v-if="documents.length === 0" class="card text-center py-12">
        <span class="text-6xl mb-4 block">📄</span>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
        <p class="text-gray-600">Start by adding your first study document</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentCard 
          v-for="document in recentDocuments"
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

const recentDocuments = computed(() => {
  return documents.value.slice(0, 4)
})

const completedCount = computed(() => {
  return documents.value.filter(doc => 
    doc.metadata.processing_status?.value === 'Completed'
  ).length
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
    error.value = 'Failed to load data. Please try again.'
    console.error('Error loading data:', e)
  } finally {
    loading.value = false
  }
})
</script>