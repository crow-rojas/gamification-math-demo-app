<template>
  <div class="katex-editor-container" ref="container">
    <KaTeXRenderer @click="startEditing" :formula="formula || '...'" :inline="inline" ref="displayDiv" />
    <div v-if="isEditing" class="floating-editor" ref="editorBox">
      <textarea v-model="tempFormula" @input="updateFormula" placeholder="Write your LaTeX here..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, defineProps, watch } from 'vue';
import KaTeXRenderer from './KaTeXRenderer.vue';
import katex from 'katex';

const props = defineProps({
  formula: {
    type: String,
    required: true
  },
  inline: {
    type: Boolean,
    default: false
  }
});

const formula = ref(props.formula);
const tempFormula = ref(formula.value);
const isEditing = ref(false);
const container = ref<HTMLElement | null>(null);
const displayDiv = ref<HTMLElement | null>(null);
const editorBox = ref<HTMLElement | null>(null);

watch(() => props.formula, (newVal) => {
  formula.value = newVal;
  tempFormula.value = newVal;
});

const startEditing = () => {
  isEditing.value = true;
  tempFormula.value = formula.value || '';
  nextTick(() => {
    if (editorBox.value) {
      editorBox.value.focus();
    }
  });
};

const updateFormula = () => {
  try {
    katex.renderToString(tempFormula.value, { throwOnError: true });
    formula.value = tempFormula.value;
  } catch {
    // If invalid, we still update the formula to show the invalid state
    formula.value = tempFormula.value;
  }
  autoResizeTextarea(); // Adjust the textarea height
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    isEditing.value &&
    container.value &&
    !container.value.contains(event.target as Node)
  ) {
    isEditing.value = false;
  }
};

const autoResizeTextarea = () => {
  nextTick(() => {
    if (editorBox.value) {
      const textarea = editorBox.value.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height to ensure accurate scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  });
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.katex-editor-container {
  position: relative;
  display: inline;
}
.floating-editor {
  position: absolute;
  z-index: 10;
  top: 100%;
  left: -70px;
}
textarea {
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  overflow-y: hidden;
  resize: none;
}
</style>
