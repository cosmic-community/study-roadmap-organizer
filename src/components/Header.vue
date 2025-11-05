<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center space-x-3">
          <span class="text-2xl">📚</span>
          <span class="text-xl font-bold text-gray-900">Study Roadmap</span>
        </router-link>
        
        <nav class="hidden md:flex items-center space-x-6">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-primary font-medium transition-colors"
            active-class="text-primary"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/roadmap" 
            class="text-gray-600 hover:text-primary font-medium transition-colors"
            active-class="text-primary"
          >
            Roadmap
          </router-link>
          <router-link 
            to="/documents" 
            class="text-gray-600 hover:text-primary font-medium transition-colors"
            active-class="text-primary"
          >
            Documents
          </router-link>
          <router-link 
            to="/categories" 
            class="text-gray-600 hover:text-primary font-medium transition-colors"
            active-class="text-primary"
          >
            Categories
          </router-link>
        </nav>

        <button 
          @click="toggleMobileMenu"
          class="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <nav class="flex flex-col space-y-3">
          <router-link 
            to="/" 
            @click="closeMobileMenu"
            class="text-gray-600 hover:text-primary font-medium transition-colors px-2 py-1"
            active-class="text-primary"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/roadmap" 
            @click="closeMobileMenu"
            class="text-gray-600 hover:text-primary font-medium transition-colors px-2 py-1"
            active-class="text-primary"
          >
            Roadmap
          </router-link>
          <router-link 
            to="/documents" 
            @click="closeMobileMenu"
            class="text-gray-600 hover:text-primary font-medium transition-colors px-2 py-1"
            active-class="text-primary"
          >
            Documents
          </router-link>
          <router-link 
            to="/categories" 
            @click="closeMobileMenu"
            class="text-gray-600 hover:text-primary font-medium transition-colors px-2 py-1"
            active-class="text-primary"
          >
            Categories
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>