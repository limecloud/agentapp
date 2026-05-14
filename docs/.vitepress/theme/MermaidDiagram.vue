<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{ code: string }>()
const id = `agentapp-mermaid-${Math.random().toString(36).slice(2)}`
const svg = ref('')
const error = ref('')

mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' })

async function renderDiagram() {
  try {
    error.value = ''
    const result = await mermaid.render(id, props.code)
    svg.value = result.svg
  } catch (err) {
    svg.value = ''
    error.value = err instanceof Error ? err.message : String(err)
  }
}

onMounted(renderDiagram)
watch(() => props.code, renderDiagram)
</script>

<template>
  <div class="aa-mermaid">
    <div v-if="svg" class="aa-mermaid__canvas" v-html="svg" />
    <pre v-else class="aa-mermaid__fallback">{{ code }}</pre>
    <p v-if="error" class="aa-mermaid__error">{{ error }}</p>
  </div>
</template>
