<template>
  <a
    v-if="isVisible"
    :href="`https://www.cosmicjs.com?utm_source=bucket_${bucketSlug}&utm_medium=referral&utm_campaign=app_badge&utm_content=built_with_cosmic`"
    target="_blank"
    rel="noopener noreferrer"
    class="cosmic-badge"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button
      @click.prevent.stop="handleDismiss"
      class="cosmic-badge-close"
      aria-label="Dismiss badge"
    >
      ×
    </button>
    
    <img 
      src="https://cdn.cosmicjs.com/b67de7d0-c810-11ed-b01d-23d7b265c299-logo508x500.svg" 
      alt="Cosmic Logo" 
      class="w-5 h-5"
    />
    Built with Cosmic
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  bucketSlug: string
}

const props = defineProps<Props>()
const isVisible = ref(false)

onMounted(() => {
  const isDismissed = localStorage.getItem('cosmic-badge-dismissed')
  if (!isDismissed) {
    setTimeout(() => {
      isVisible.value = true
    }, 1000)
  }
})

const handleDismiss = () => {
  isVisible.value = false
  localStorage.setItem('cosmic-badge-dismissed', 'true')
}

const handleMouseEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.backgroundColor = '#f9fafb'
}

const handleMouseLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.backgroundColor = 'white'
}
</script>

<style scoped>
.cosmic-badge {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #11171A;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 12px 16px;
  width: 180px;
  border-radius: 8px;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;
  font-family: system-ui, -apple-system, sans-serif;
}

.cosmic-badge-close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  color: #374151;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 10;
}

.cosmic-badge-close:hover {
  background-color: #e5e7eb;
}
</style>