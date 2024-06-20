<template>
  <div>
    <textarea v-model="formula" placeholder="Write your LaTeX here..." />
    <div class="katex-container">
      <KaTeXRenderer :formula="formula" />
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import KaTeXRenderer from './KaTeXRenderer.vue';
import katex from 'katex';

const formula = ref('c = \\pm\\sqrt{a^2 + b^2}');
const error = ref('');

watch(formula, (newFormula) => {
  try {
    katex.renderToString(newFormula, { throwOnError: true });
    error.value = '';
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = 'An unknown error occurred';
    }
  }
});
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}
.katex-container {
  position: relative;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 50px;
}
.error-message {
  color: red;
  position: absolute;
  top: 0;
  right: 10px;
}
</style>
